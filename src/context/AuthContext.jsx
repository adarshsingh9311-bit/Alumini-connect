import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { USER_ROLES } from "../lib/constants";

export const ALLOWED_COLLEGE_DOMAIN = "@glbitm.ac.in";

export function isCollegeEmail(emailStr) {
  if (!emailStr || typeof emailStr !== "string") return false;
  const clean = emailStr.trim().toLowerCase();
  return clean.endsWith(ALLOWED_COLLEGE_DOMAIN) && clean.length > ALLOWED_COLLEGE_DOMAIN.length;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'alumni' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Initialize session from Supabase
  useEffect(() => {
    let authListener = null;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn("Supabase session error:", error);
          }
          if (session?.user) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
            setRole(null);
          }

          const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              setUser(session.user);
              await fetchUserProfile(session.user.id);
            } else {
              setUser(null);
              setProfile(null);
              setRole(null);
            }
          });
          authListener = listener?.subscription;
        } catch (err) {
          console.warn("Auth initialization failed:", err);
          setUser(null);
          setProfile(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    }

    initAuth();

    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  // Fetch full user profile joined with role-specific table
  async function fetchUserProfile(userId) {
    if (!isSupabaseConfigured || !supabase || !userId) return null;

    try {
      const { data: baseProfile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      let effectiveRole = baseProfile?.role;
      let detailedProfile = baseProfile ? { ...baseProfile } : null;

      // If base profile record is missing from profiles table, fallback to user metadata
      if (!detailedProfile && user?.user_metadata) {
        effectiveRole = user.user_metadata.role || USER_ROLES.STUDENT;
        detailedProfile = {
          id: userId,
          email: user.email,
          full_name: user.user_metadata.full_name || "GLB Member",
          role: effectiveRole,
          roll_number: user.user_metadata.roll_number || "",
          branch: user.user_metadata.branch || "CSE",
          batch: user.user_metadata.batch || "2023-2027",
          graduation_year: user.user_metadata.graduation_year || 2027,
          phone: user.user_metadata.phone || "",
          skills: user.user_metadata.skills || [],
          bio: user.user_metadata.bio || ""
        };
      }

      if (!detailedProfile) {
        console.warn("Could not find profile for user:", userId, profileError);
        return null;
      }

      setRole(effectiveRole);

      if (effectiveRole === USER_ROLES.STUDENT) {
        const { data: studentData } = await supabase
          .from("students")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (studentData) {
          detailedProfile = { ...detailedProfile, ...studentData };
        }
      } else if (effectiveRole === USER_ROLES.ALUMNI) {
        const { data: alumniData } = await supabase
          .from("alumni")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (alumniData) {
          detailedProfile = { ...detailedProfile, ...alumniData };
        }
      } else if (effectiveRole === USER_ROLES.ADMIN) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (adminData) {
          detailedProfile = { ...detailedProfile, ...adminData };
        }
      }

      setProfile(detailedProfile);
      return detailedProfile;
    } catch (err) {
      console.warn("Failed to fetch detailed profile:", err);
      return null;
    }
  }

  // Official College Login with Strict Domain and Role Verification
  async function login({ email, rollNumber, identifier, password, role: targetRole }) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please contact the administrator.");
    }

    const cleanEmail = (email || identifier || "").trim().toLowerCase();
    const cleanRoll = (rollNumber || "").trim();

    if (!cleanEmail || !password) {
      throw new Error("Both college email and password are required.");
    }

    // 1. Validate email domain (@glbitm.ac.in only)
    if (!isCollegeEmail(cleanEmail)) {
      throw new Error("Please use your official @glbitm.ac.in college email.");
    }

    // 2. Validate roll number requirement for Student and Alumni
    if (targetRole === USER_ROLES.STUDENT && !cleanRoll) {
      throw new Error("College Roll Number is required.");
    }
    if (targetRole === USER_ROLES.ALUMNI && !cleanRoll) {
      throw new Error("College Roll Number / Alumni Identifier is required.");
    }

    // 3. Authenticate credentials with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (authError || !authData?.user) {
      const errMsg = authError?.message || "";
      if (errMsg.toLowerCase().includes("email not confirmed")) {
        throw new Error("Your college email has not been verified yet. Please check your inbox for the verification link before logging in.");
      }
      if (errMsg.toLowerCase().includes("invalid login credentials")) {
        throw new Error("Invalid college email or password.");
      }
      throw new Error(errMsg || "Invalid login credentials.");
    }

    const userId = authData.user.id;
    const userMeta = authData.user.user_metadata || {};

    // 4. Fetch user's registered profile from database
    const { data: profileRecord } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    // Determine role (database profile takes precedence, falling back to user metadata)
    let registeredRole = profileRecord?.role;

    // Self-healing: If user metadata specifies 'alumni' but database profile was defaulted to 'student' by initial trigger,
    // sync the profile table using the authenticated user's session (strictly protecting admin role)
    if (userMeta.role === USER_ROLES.ALUMNI && registeredRole !== USER_ROLES.ALUMNI && registeredRole !== USER_ROLES.ADMIN) {
      try {
        await supabase.from("profiles").update({ role: USER_ROLES.ALUMNI }).eq("id", userId);
        registeredRole = USER_ROLES.ALUMNI;
        if (profileRecord) profileRecord.role = USER_ROLES.ALUMNI;
      } catch (e) {
        console.warn("Could not sync profile role:", e);
      }
    } else if (!registeredRole) {
      registeredRole = userMeta.role;
    }

    if (!registeredRole) {
      throw new Error("Your college profile is being set up. Please contact admin if this persists.");
    }

    // 5. Strict Portal & Role Authorization Checks
    if (targetRole === USER_ROLES.ADMIN) {
      if (registeredRole !== USER_ROLES.ADMIN) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("You are not authorized to access the Admin Portal.");
      }

      // Admins table lookup
      const { data: adminRecord } = await supabase
        .from("admins")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const fullAdminProfile = {
        id: userId,
        email: cleanEmail,
        full_name: profileRecord?.full_name || userMeta.full_name || "GL Bajaj Administrator",
        role: USER_ROLES.ADMIN,
        ...(profileRecord || {}),
        ...(adminRecord || {})
      };

      setUser(authData.user);
      setProfile(fullAdminProfile);
      setRole(USER_ROLES.ADMIN);
      return { user: authData.user, profile: fullAdminProfile, role: USER_ROLES.ADMIN };

    } else if (targetRole === USER_ROLES.STUDENT) {
      if (registeredRole === USER_ROLES.ALUMNI) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("This account is registered as Alumni. Please log in through the Alumni Portal.");
      }
      if (registeredRole === USER_ROLES.ADMIN) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("This account is an Administrator. Please log in through the Admin Portal.");
      }

      // Fetch student record
      const { data: studentRecord } = await supabase
        .from("students")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      // Check roll number against registered records
      const registeredRoll = (studentRecord?.roll_number || userMeta.roll_number || "").trim().toLowerCase();
      if (registeredRoll && cleanRoll.toLowerCase() !== registeredRoll) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("The roll number entered does not match this college account.");
      }

      const fullStudentProfile = {
        id: userId,
        email: cleanEmail,
        full_name: profileRecord?.full_name || userMeta.full_name || "GLB Scholar",
        role: USER_ROLES.STUDENT,
        roll_number: cleanRoll || registeredRoll,
        branch: studentRecord?.branch || userMeta.branch || "CSE",
        batch: studentRecord?.batch || userMeta.batch || "2023-2027",
        graduation_year: studentRecord?.graduation_year || userMeta.graduation_year || 2027,
        ...(profileRecord || {}),
        ...(studentRecord || {})
      };

      setUser(authData.user);
      setProfile(fullStudentProfile);
      setRole(USER_ROLES.STUDENT);
      return { user: authData.user, profile: fullStudentProfile, role: USER_ROLES.STUDENT };

    } else if (targetRole === USER_ROLES.ALUMNI) {
      if (registeredRole === USER_ROLES.STUDENT) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("This account is registered as a Student. Please log in through the Student Portal.");
      }
      if (registeredRole === USER_ROLES.ADMIN) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("This account is an Administrator. Please log in through the Admin Portal.");
      }

      // Fetch alumni record
      const { data: alumniRecord } = await supabase
        .from("alumni")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      // Check roll number / alumni identifier
      const registeredRoll = (alumniRecord?.roll_number || userMeta.roll_number || "").trim().toLowerCase();
      if (registeredRoll && cleanRoll.toLowerCase() !== registeredRoll) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("The roll number or alumni identifier entered does not match this college account.");
      }

      const fullAlumniProfile = {
        id: userId,
        email: cleanEmail,
        full_name: profileRecord?.full_name || userMeta.full_name || "GLB Alumnus",
        role: USER_ROLES.ALUMNI,
        roll_number: cleanRoll || registeredRoll,
        branch: alumniRecord?.branch || userMeta.branch || "CSE",
        batch: alumniRecord?.batch || userMeta.batch || "2019-2023",
        graduation_year: alumniRecord?.graduation_year || userMeta.graduation_year || 2023,
        mentorship_available: alumniRecord?.mentorship_available ?? true,
        verified: alumniRecord?.verified ?? false,
        ...(profileRecord || {}),
        ...(alumniRecord || {})
      };

      setUser(authData.user);
      setProfile(fullAlumniProfile);
      setRole(USER_ROLES.ALUMNI);
      return { user: authData.user, profile: fullAlumniProfile, role: USER_ROLES.ALUMNI };

    } else {
      // General portal login: role auto-detected
      const fullProfile = await fetchUserProfile(userId);
      setUser(authData.user);
      return { user: authData.user, profile: fullProfile, role: registeredRole };
    }
  }

  // Real Supabase Registration (Only Student and Alumni allowed)
  async function register(data, targetRole) {
    if (targetRole === USER_ROLES.ADMIN || targetRole === "admin") {
      throw new Error("Admin registration is not allowed publicly. Administrator accounts are provisioned directly by the college.");
    }

    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please contact the administrator.");
    }

    const cleanEmail = (data.email || "").trim().toLowerCase();
    const cleanRoll = (data.roll_number || "").trim();

    // 1. Email domain validation (@glbitm.ac.in only)
    if (!isCollegeEmail(cleanEmail)) {
      throw new Error("Please use your official @glbitm.ac.in college email.");
    }

    // 2. Roll number and password checks
    if (!cleanRoll) {
      throw new Error("College Roll Number is required.");
    }
    if (!data.password || data.password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    // 3. Graduation year validation
    const gradYearNum = parseInt(data.batch_year || data.graduation_year || "2027", 10);
    if (isNaN(gradYearNum) || gradYearNum < 2005 || gradYearNum > 2050) {
      throw new Error("Graduation year must be between 2005 and 2050 inclusive.");
    }

    // 4. Verify user against existing student/alumni database records where applicable
    if (targetRole === USER_ROLES.STUDENT) {
      const { data: existingStudent } = await supabase
        .from("students")
        .select("id")
        .eq("roll_number", cleanRoll)
        .maybeSingle();

      if (existingStudent) {
        throw new Error("A student account with this Roll Number is already registered.");
      }
    } else if (targetRole === USER_ROLES.ALUMNI) {
      const { data: existingAlumni } = await supabase
        .from("alumni")
        .select("id")
        .eq("roll_number", cleanRoll)
        .maybeSingle();

      if (existingAlumni) {
        throw new Error("An alumni account with this Roll Number / Identifier is already registered.");
      }
    }

    // 5. Create user in Supabase Auth with complete metadata and email redirect URL
    const skillsArray = data.skills
      ? (Array.isArray(data.skills) ? data.skills : data.skills.split(",").map((s) => s.trim()).filter(Boolean))
      : [];

    const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "https://glbajaj-alumni-connect.vercel.app";

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: data.password,
      options: {
        emailRedirectTo: `${redirectOrigin}/login?verified=true`,
        data: {
          full_name: data.full_name || "GLB Member",
          roll_number: cleanRoll,
          role: targetRole,
          branch: data.branch || "CSE",
          batch: data.batch_year || data.batch || String(gradYearNum),
          graduation_year: gradYearNum,
          phone: data.phone || "",
          skills: skillsArray,
          bio: data.bio || "",
          ...(targetRole === USER_ROLES.ALUMNI && {
            current_company: data.current_company || "",
            current_designation: data.current_designation || "",
            industry: data.industry || "",
            location: data.location || "",
            mentorship_available: true,
            verified: false
          })
        },
      },
    });

    if (authError) {
      const errMsg = authError.message || "";
      const errCode = authError.code || "";
      if (errCode === "over_email_send_rate_limit" || errMsg.toLowerCase().includes("rate limit") || errMsg.toLowerCase().includes("over_email_send_rate_limit")) {
        throw new Error("College verification email limit reached. Please wait a few minutes before trying again or contact the administrator.");
      }
      if (errMsg.toLowerCase().includes("user already registered")) {
        throw new Error("An account is already registered with this college email. If you have not verified your email, please use the resend verification option on the login page.");
      }
      throw new Error(errMsg || "Registration failed.");
    }

    const emailConfirmationRequired = !authData?.session;
    const newUserId = authData.user?.id;

    // 6. If immediate session exists (email confirmation disabled in Supabase), ensure DB records exist
    if (authData.session && newUserId) {
      try {
        await supabase.from("profiles").upsert({
          id: newUserId,
          full_name: data.full_name || "GLB Member",
          email: cleanEmail,
          role: targetRole,
          phone: data.phone || "",
        });

        if (targetRole === USER_ROLES.STUDENT) {
          await supabase.from("students").upsert({
            id: newUserId,
            roll_number: cleanRoll,
            branch: data.branch || "CSE",
            batch: data.batch_year || data.batch || String(gradYearNum),
            graduation_year: gradYearNum,
            skills: skillsArray,
            bio: data.bio || ""
          });
        } else if (targetRole === USER_ROLES.ALUMNI) {
          await supabase.from("alumni").upsert({
            id: newUserId,
            roll_number: cleanRoll,
            branch: data.branch || "CSE",
            batch: data.batch_year || data.batch || String(gradYearNum),
            graduation_year: gradYearNum,
            current_company: data.current_company || "",
            current_designation: data.current_designation || "",
            industry: data.industry || "",
            location: data.location || "",
            skills: skillsArray,
            bio: data.bio || "",
            mentorship_available: true,
            verified: false
          });
        }
      } catch (err) {
        console.warn("Non-fatal profile setup notice:", err);
      }
    }

    return {
      ...authData,
      emailConfirmationRequired,
      email: cleanEmail
    };
  }

  // Resend Email Confirmation Link
  async function resendConfirmationEmail(emailInput) {
    if (!emailInput) throw new Error("College Email is required.");
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please contact the administrator.");
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!isCollegeEmail(cleanEmail)) {
      throw new Error("Please use your official @glbitm.ac.in college email.");
    }

    const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "https://glbajaj-alumni-connect.vercel.app";

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: cleanEmail,
      options: {
        emailRedirectTo: `${redirectOrigin}/login?verified=true`
      }
    });

    if (error) {
      const errMsg = error.message || "";
      const errCode = error.code || "";
      if (errCode === "over_email_send_rate_limit" || errMsg.toLowerCase().includes("rate limit") || errMsg.toLowerCase().includes("over_email_send_rate_limit")) {
        throw new Error("College verification email limit reached. Please wait a few minutes before requesting another verification email.");
      }
      throw new Error(error.message || "Failed to resend confirmation email.");
    }
    return true;
  }

  // Password Recovery for official college email
  async function resetPassword(emailInput) {
    if (!emailInput) throw new Error("College Email is required.");
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please contact the administrator.");
    }

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!isCollegeEmail(cleanEmail)) {
      throw new Error("Please use your official @glbitm.ac.in college email.");
    }

    const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "https://glbajaj-alumni-connect.vercel.app";

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${redirectOrigin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message || "Failed to process password recovery.");
    }
    return true;
  }

  // Logout
  async function logout() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Error signing out:", err);
      }
    }
    setUser(null);
    setProfile(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        login,
        register,
        resendConfirmationEmail,
        resetPassword,
        logout,
        fetchUserProfile,
        isConfigured: isSupabaseConfigured,
        isStudent: role === USER_ROLES.STUDENT,
        isAlumni: role === USER_ROLES.ALUMNI,
        isAdmin: role === USER_ROLES.ADMIN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
