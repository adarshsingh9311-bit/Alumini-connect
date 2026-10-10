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
        .single();

      if (profileError || !baseProfile) {
        console.warn("Could not find profile for user:", userId, profileError);
        return null;
      }

      const userRole = baseProfile.role;
      setRole(userRole);

      let detailedProfile = { ...baseProfile };

      if (userRole === USER_ROLES.STUDENT) {
        const { data: studentData } = await supabase
          .from("students")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (studentData) {
          detailedProfile = { ...detailedProfile, ...studentData };
        }
      } else if (userRole === USER_ROLES.ALUMNI) {
        const { data: alumniData } = await supabase
          .from("alumni")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (alumniData) {
          detailedProfile = { ...detailedProfile, ...alumniData };
        }
      } else if (userRole === USER_ROLES.ADMIN) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", userId)
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
      throw new Error("Invalid login credentials.");
    }

    const userId = authData.user.id;

    // 4. Fetch user's registered profile from database
    const { data: profileRecord, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr || !profileRecord) {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRole(null);
      throw new Error("Invalid login credentials.");
    }

    // 5. Role and roll-number relationship validation
    if (targetRole === USER_ROLES.STUDENT) {
      // Must have student role
      if (profileRecord.role !== USER_ROLES.STUDENT) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("The college email and roll number do not match our records.");
      }

      // Roll number verification
      const { data: studentRecord } = await supabase
        .from("students")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const dbRoll = (studentRecord?.roll_number || "").trim().toLowerCase();
      if (!studentRecord || dbRoll !== cleanRoll.toLowerCase()) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("The college email and roll number do not match our records.");
      }

      const fullProfile = { ...profileRecord, ...studentRecord };
      setUser(authData.user);
      setProfile(fullProfile);
      setRole(USER_ROLES.STUDENT);
      return { user: authData.user, profile: fullProfile };

    } else if (targetRole === USER_ROLES.ALUMNI) {
      // Must have alumni role
      if (profileRecord.role !== USER_ROLES.ALUMNI) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("The college email and roll number do not match our records.");
      }

      // Roll number / Alumni identifier verification
      const { data: alumniRecord } = await supabase
        .from("alumni")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      const dbRoll = (alumniRecord?.roll_number || "").trim().toLowerCase();
      if (!alumniRecord || dbRoll !== cleanRoll.toLowerCase()) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("The college email and roll number do not match our records.");
      }

      const fullProfile = { ...profileRecord, ...alumniRecord };
      setUser(authData.user);
      setProfile(fullProfile);
      setRole(USER_ROLES.ALUMNI);
      return { user: authData.user, profile: fullProfile };

    } else if (targetRole === USER_ROLES.ADMIN) {
      // Must have admin role in profile
      if (profileRecord.role !== USER_ROLES.ADMIN) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("You are not authorized to access the Admin Portal.");
      }

      // Must exist in admins table
      const { data: adminRecord } = await supabase
        .from("admins")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!adminRecord) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRole(null);
        throw new Error("You are not authorized to access the Admin Portal.");
      }

      const fullProfile = { ...profileRecord, ...adminRecord };
      setUser(authData.user);
      setProfile(fullProfile);
      setRole(USER_ROLES.ADMIN);
      return { user: authData.user, profile: fullProfile };

    } else {
      // If no specific role portal was chosen, check the user's registered role
      if (profileRecord.role === USER_ROLES.ADMIN) {
        const { data: adminRecord } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (!adminRecord) {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setRole(null);
          throw new Error("You are not authorized to access the Admin Portal.");
        }
      }

      const fullProfile = await fetchUserProfile(userId);
      setUser(authData.user);
      return { user: authData.user, profile: fullProfile };
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

    // 3. Verify user against existing student/alumni database records where applicable
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

    // 4. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          roll_number: cleanRoll,
          role: targetRole,
        },
      },
    });

    if (authError) {
      throw new Error(authError.message || "Registration failed.");
    }

    const newUserId = authData.user?.id;
    if (!newUserId) {
      return authData;
    }

    // 5. Insert Base Profile
    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: newUserId,
      full_name: data.full_name || "GLB Member",
      email: cleanEmail,
      role: targetRole,
      phone: data.phone || "",
    });

    if (profileErr) {
      console.warn("Error upserting profile:", profileErr);
    }

    // 6. Insert Role-specific Record
    if (targetRole === USER_ROLES.STUDENT) {
      const skillsArray = data.skills
        ? (Array.isArray(data.skills) ? data.skills : data.skills.split(",").map((s) => s.trim()).filter(Boolean))
        : [];

      await supabase.from("students").upsert({
        user_id: newUserId,
        roll_number: cleanRoll,
        branch: data.branch || "CSE",
        batch_year: data.batch_year || "2024",
        skills: skillsArray,
        interests: data.interests || "",
        bio: data.bio || "",
      });
    } else if (targetRole === USER_ROLES.ALUMNI) {
      const skillsArray = data.skills
        ? (Array.isArray(data.skills) ? data.skills : data.skills.split(",").map((s) => s.trim()).filter(Boolean))
        : [];

      await supabase.from("alumni").upsert({
        user_id: newUserId,
        roll_number: cleanRoll,
        branch: data.branch || "CSE",
        graduation_year: data.batch_year || data.graduation_year || "2022",
        current_company: data.current_company || "",
        current_designation: data.current_designation || "",
        industry: data.industry || "",
        location: data.location || "",
        skills: skillsArray,
        bio: data.bio || "",
        is_available_for_mentorship: true,
        is_verified: false, // New alumni requires verification by Admin
      });
    }

    return authData;
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

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/login`,
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
