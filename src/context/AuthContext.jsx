import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { USER_ROLES } from "../lib/constants";

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
        // Real Supabase not configured in current environment
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
          .single();
        if (studentData) {
          detailedProfile = { ...detailedProfile, ...studentData };
        }
      } else if (userRole === USER_ROLES.ALUMNI) {
        const { data: alumniData } = await supabase
          .from("alumni")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (alumniData) {
          detailedProfile = { ...detailedProfile, ...alumniData };
        }
      } else if (userRole === USER_ROLES.ADMIN) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", userId)
          .single();
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

  // Real Supabase Login with Role Validation
  async function login({ identifier, password, role: targetRole }) {
    if (!identifier || !password) {
      throw new Error("Both login identifier and password are required.");
    }

    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY settings in .env.");
    }

    let authEmail = identifier.trim();

    // If identifier is not an email, lookup email from students or alumni by roll number
    if (!authEmail.includes("@")) {
      const cleanRoll = identifier.trim();
      let foundEmail = null;

      if (targetRole === USER_ROLES.STUDENT || !targetRole) {
        const { data: stRecord } = await supabase
          .from("students")
          .select("user_id, profiles!inner(email)")
          .eq("roll_number", cleanRoll)
          .maybeSingle();

        if (stRecord?.profiles?.email) {
          foundEmail = stRecord.profiles.email;
        }
      }

      if (!foundEmail && (targetRole === USER_ROLES.ALUMNI || !targetRole)) {
        const { data: alRecord } = await supabase
          .from("alumni")
          .select("user_id, profiles!inner(email)")
          .eq("roll_number", cleanRoll)
          .maybeSingle();

        if (alRecord?.profiles?.email) {
          foundEmail = alRecord.profiles.email;
        }
      }

      authEmail = foundEmail || `${cleanRoll.toLowerCase()}@glbajaj.org`;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: password
    });

    if (error) {
      throw new Error(error.message || "Invalid credentials. Please verify your credentials.");
    }

    if (!data.user) {
      throw new Error("Authentication failed. No user record returned.");
    }

    // Verify role matches requested portal
    const fetchedProfile = await fetchUserProfile(data.user.id);
    if (fetchedProfile && targetRole && fetchedProfile.role !== targetRole) {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRole(null);
      throw new Error(
        `This account is registered as ${fetchedProfile.role.toUpperCase()}. Please select the ${fetchedProfile.role.toUpperCase()} portal to sign in.`
      );
    }

    setUser(data.user);
    return { user: data.user, profile: fetchedProfile };
  }

  // Real Supabase Registration
  async function register(data, targetRole) {
    if (targetRole === USER_ROLES.ADMIN) {
      throw new Error("Admin registration is not allowed publicly. Administrator accounts are provisioned directly by the college.");
    }

    if (!data.roll_number || !data.password) {
      throw new Error("Roll Number and Password are required.");
    }

    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured. Please set your Supabase credentials in .env.");
    }

    const emailToUse = data.email ? data.email.trim() : `${data.roll_number.trim().toLowerCase()}@glbajaj.org`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailToUse,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          roll_number: data.roll_number.trim(),
          role: targetRole
        }
      }
    });

    if (authError) {
      throw new Error(authError.message || "Registration failed.");
    }

    const newUserId = authData.user?.id;
    if (!newUserId) {
      return authData;
    }

    // Insert Base Profile
    const { error: profileErr } = await supabase.from("profiles").upsert({
      id: newUserId,
      full_name: data.full_name || "GLB Member",
      email: emailToUse,
      role: targetRole,
      phone: data.phone || ""
    });

    if (profileErr) {
      console.warn("Error upserting profile:", profileErr);
    }

    // Insert Role Table Record
    if (targetRole === USER_ROLES.STUDENT) {
      const skillsArray = data.skills
        ? (Array.isArray(data.skills) ? data.skills : data.skills.split(",").map(s => s.trim()).filter(Boolean))
        : [];

      await supabase.from("students").upsert({
        user_id: newUserId,
        roll_number: data.roll_number.trim(),
        branch: data.branch || "CSE",
        batch_year: data.batch_year || "2024",
        skills: skillsArray,
        interests: data.interests || "",
        bio: data.bio || ""
      });
    } else if (targetRole === USER_ROLES.ALUMNI) {
      const skillsArray = data.skills
        ? (Array.isArray(data.skills) ? data.skills : data.skills.split(",").map(s => s.trim()).filter(Boolean))
        : [];

      await supabase.from("alumni").upsert({
        user_id: newUserId,
        roll_number: data.roll_number.trim(),
        branch: data.branch || "CSE",
        graduation_year: data.batch_year || data.graduation_year || "2022",
        current_company: data.current_company || "",
        current_designation: data.current_designation || "",
        industry: data.industry || "",
        location: data.location || "",
        skills: skillsArray,
        bio: data.bio || "",
        is_available_for_mentorship: true,
        is_verified: false // New alumni must be verified by admin
      });
    }

    setUser(authData.user);
    setRole(targetRole);
    await fetchUserProfile(newUserId);
    return authData;
  }

  // Password Reset
  async function resetPassword(identifier) {
    if (!identifier) throw new Error("Roll Number or Email is required.");
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Supabase is not configured.");
    }

    let emailToReset = identifier.trim();
    if (!emailToReset.includes("@")) {
      // Lookup in students or alumni
      const { data: st } = await supabase
        .from("students")
        .select("profiles!inner(email)")
        .eq("roll_number", identifier.trim())
        .maybeSingle();

      if (st?.profiles?.email) {
        emailToReset = st.profiles.email;
      } else {
        const { data: al } = await supabase
          .from("alumni")
          .select("profiles!inner(email)")
          .eq("roll_number", identifier.trim())
          .maybeSingle();

        if (al?.profiles?.email) {
          emailToReset = al.profiles.email;
        } else {
          emailToReset = `${identifier.trim().toLowerCase()}@glbajaj.org`;
        }
      }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailToReset);
    if (error) throw error;
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
        isAdmin: role === USER_ROLES.ADMIN
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
