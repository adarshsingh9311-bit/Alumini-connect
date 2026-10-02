import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { USER_ROLES } from "../lib/constants";
import { INITIAL_STUDENTS, INITIAL_ALUMNI } from "../lib/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'alumni' | 'admin' | null
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let authListener = null;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchUserProfile(session.user.id);
          } else {
            loadSavedLocalSession();
          }

          const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
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
          console.warn("Supabase auth error during init:", err);
          loadSavedLocalSession();
        }
      } else {
        loadSavedLocalSession();
      }
      setLoading(false);
    }

    initAuth();

    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  function loadSavedLocalSession() {
    const saved = localStorage.getItem("glb_alumni_auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setProfile(parsed.profile);
        setRole(parsed.role);
      } catch (e) {
        localStorage.removeItem("glb_alumni_auth");
      }
    }
  }

  async function fetchUserProfile(userId) {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      const { data: baseProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!baseProfile) return;

      const userRole = baseProfile.role;
      setRole(userRole);

      if (userRole === USER_ROLES.STUDENT) {
        const { data: studentData } = await supabase
          .from("students")
          .select("*")
          .eq("user_id", userId)
          .single();
        setProfile({ ...baseProfile, ...studentData });
      } else if (userRole === USER_ROLES.ALUMNI) {
        const { data: alumniData } = await supabase
          .from("alumni")
          .select("*")
          .eq("user_id", userId)
          .single();
        setProfile({ ...baseProfile, ...alumniData });
      } else if (userRole === USER_ROLES.ADMIN) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", userId)
          .single();
        setProfile({ ...baseProfile, ...adminData });
      } else {
        setProfile(baseProfile);
      }
    } catch (err) {
      console.warn("Failed to fetch detailed profile:", err);
    }
  }

  // Roll Number + Password Login (or Email for Admin)
  async function login({ identifier, password, role: targetRole }) {
    if (!identifier || !password) {
      throw new Error("Both login identifier and password are required.");
    }

    if (isSupabaseConfigured && supabase) {
      // In Supabase Auth, login is done via email.
      // If user provided a roll number, find their linked email from profiles / students / alumni table first
      let authEmail = identifier;
      if (!identifier.includes("@")) {
        const tableName = targetRole === USER_ROLES.STUDENT ? "students" : "alumni";
        const { data: matchedRecord } = await supabase
          .from(tableName)
          .select("user_id, profiles!inner(email)")
          .eq("roll_number", identifier)
          .single();

        if (matchedRecord?.profiles?.email) {
          authEmail = matchedRecord.profiles.email;
        } else {
          authEmail = `${identifier.toLowerCase()}@glbajaj.org`;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
      }
      return data;
    }

    // Local / Offline demo login fallback
    let localProfile = null;
    let assignedRole = targetRole || USER_ROLES.STUDENT;

    if (assignedRole === USER_ROLES.STUDENT) {
      localProfile = INITIAL_STUDENTS.find(s => s.roll_number === identifier) || {
        ...INITIAL_STUDENTS[0],
        roll_number: identifier.includes("@") ? INITIAL_STUDENTS[0].roll_number : identifier
      };
    } else if (assignedRole === USER_ROLES.ALUMNI) {
      localProfile = INITIAL_ALUMNI.find(a => a.roll_number === identifier) || {
        ...INITIAL_ALUMNI[0],
        roll_number: identifier.includes("@") ? INITIAL_ALUMNI[0].roll_number : identifier
      };
    } else {
      localProfile = {
        id: "admin-1",
        full_name: "GL Bajaj Central Administration",
        email: identifier.includes("@") ? identifier : "admin@glbajaj.org",
        role: USER_ROLES.ADMIN,
        department: "Dean Alumni Relations & Administration",
        designation: "Administrator"
      };
    }

    const mockUser = { id: localProfile.user_id || "mock-" + assignedRole, email: localProfile.email };
    setUser(mockUser);
    setProfile(localProfile);
    setRole(assignedRole);

    localStorage.setItem(
      "glb_alumni_auth",
      JSON.stringify({ user: mockUser, profile: localProfile, role: assignedRole })
    );

    return { user: mockUser, profile: localProfile };
  }

  // Roll Number + Password Registration
  async function register(data, targetRole) {
    if (targetRole === USER_ROLES.ADMIN) {
      throw new Error("Admin registration is not publicly allowed. Accounts are authorized directly by the college.");
    }

    if (!data.roll_number || !data.password) {
      throw new Error("Roll Number and Password are required.");
    }

    if (isSupabaseConfigured && supabase) {
      const emailToUse = data.email || `${data.roll_number.toLowerCase()}@glbajaj.org`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailToUse,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            roll_number: data.roll_number,
            role: targetRole
          }
        }
      });
      if (authError) throw authError;

      const newUserId = authData.user?.id;
      if (!newUserId) return authData;

      // Base profile
      await supabase.from("profiles").insert({
        id: newUserId,
        full_name: data.full_name,
        email: emailToUse,
        role: targetRole,
        phone: data.phone || ""
      });

      if (targetRole === USER_ROLES.STUDENT) {
        await supabase.from("students").insert({
          user_id: newUserId,
          roll_number: data.roll_number,
          branch: data.branch,
          batch_year: data.batch_year,
          skills: data.skills ? data.skills.split(",").map(s => s.trim()) : []
        });
      } else if (targetRole === USER_ROLES.ALUMNI) {
        await supabase.from("alumni").insert({
          user_id: newUserId,
          roll_number: data.roll_number,
          branch: data.branch,
          batch_year: data.batch_year,
          current_company: data.current_company || "",
          current_designation: data.current_designation || "",
          industry: data.industry || "",
          location: data.location || "",
          skills: data.skills ? data.skills.split(",").map(s => s.trim()) : [],
          bio: data.bio || "",
          is_available_for_mentorship: true,
          is_verified: data.is_verified ?? false
        });
      }

      setUser(authData.user);
      setRole(targetRole);
      await fetchUserProfile(newUserId);
      return authData;
    }

    // Local / Demo Mode Registration
    const isAutoVerified = targetRole === USER_ROLES.STUDENT ? true : Boolean(data.is_verified);
    const newProfile = {
      id: "local-" + Date.now(),
      user_id: "user-" + Date.now(),
      ...data,
      role: targetRole,
      is_verified: isAutoVerified
    };

    const mockUser = { id: newProfile.user_id, email: data.email || `${data.roll_number}@glbajaj.org` };
    setUser(mockUser);
    setProfile(newProfile);
    setRole(targetRole);

    localStorage.setItem(
      "glb_alumni_auth",
      JSON.stringify({ user: mockUser, profile: newProfile, role: targetRole })
    );

    return { user: mockUser, profile: newProfile };
  }

  // Forgot password
  async function resetPassword(identifier) {
    if (isSupabaseConfigured && supabase && identifier.includes("@")) {
      const { error } = await supabase.auth.resetPasswordForEmail(identifier);
      if (error) throw error;
      return true;
    }
    // Simulation
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
    localStorage.removeItem("glb_alumni_auth");
  }

  // Quick switch for testing demo portals
  function setDemoPortal(targetRole) {
    let newProfile = null;
    if (targetRole === USER_ROLES.STUDENT) {
      newProfile = INITIAL_STUDENTS[0];
    } else if (targetRole === USER_ROLES.ALUMNI) {
      newProfile = INITIAL_ALUMNI[0];
    } else if (targetRole === USER_ROLES.ADMIN) {
      newProfile = {
        id: "admin-1",
        full_name: "GL Bajaj Central Administration",
        email: "admin@glbajaj.org",
        role: USER_ROLES.ADMIN,
        department: "Dean Alumni Relations & Administration",
        designation: "Administrator"
      };
    } else {
      setUser(null);
      setProfile(null);
      setRole(null);
      localStorage.removeItem("glb_alumni_auth");
      return;
    }

    const mockUser = { id: newProfile.user_id || "demo-" + targetRole, email: newProfile.email };
    setUser(mockUser);
    setProfile(newProfile);
    setRole(targetRole);

    localStorage.setItem(
      "glb_alumni_auth",
      JSON.stringify({ user: mockUser, profile: newProfile, role: targetRole })
    );
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
        setDemoPortal,
        isConfigured: isSupabaseConfigured
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
