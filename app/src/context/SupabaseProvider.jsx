// Usage:
// import { useSupabase } from "pathTo/SupabaseProvider";
// const {supabase, session} = useSupabase();

// access token 在 session.access_token
// 從 session.user 也能拿到 user 資訊

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { supabase } from "../utils/supaClient";

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  const [session, setSession] = useState(null);
  // control the reset passwrod prompt to show only once
  const hasPrompted = useRef(false);

  async function getCurSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      // console.log(session);
      if (session) setSession(session);
      if (error) console.log(error.message);
    } catch (err) {
      console.log("error retrieve session: ", err);
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_e, session) => {
      getCurSession();
      // setSession(session);
      // remember to remove console logs
      if (_e === "INITIAL_SESSION") {
        console.log("INITIAL_SESSION");
        // handle initial session
      } else if (_e === "SIGNED_IN") {
        console.log("SIGNED_IN");
        // handle sign in event
      } else if (_e === "SIGNED_OUT") {
        console.log("SIGNED_OUT");
        setSession(null);
        // handle sign out event
      } else if (_e === "PASSWORD_RECOVERY" && !hasPrompted.current) {
        hasPrompted.current = true;
        console.log("PASSWORD_RECOVERY");
        // handle password recovery event
        try {
          const newPassword = prompt("What would you like your new password to be?(at least 6 characters)");
          if (newPassword) {
            const { data, error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) window.alert("There was an error updating your password.");
            else if (data) window.alert("Password updated successfully!");
            // console.log(error);
          } else {
            console.log("cancelled");
          }
        } catch (err) {
          console.log("err during reset password ", err);
        } finally {
          hasPrompted.current = false;
        }
      } else if (_e === "TOKEN_REFRESHED") {
        console.log("TOKEN_REFRESHED");
        // handle token refreshed event
      } else if (_e === "USER_UPDATED") {
        console.log("USER_UPDATED");
        // handle user updated event
      }
    });

    return () => {
      if (authListener?.subscription) authListener.subscription.unsubscribe();
    };
  }, []);

  return <SupabaseContext.Provider value={{ supabase, session }}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  // return useContext(SupabaseContext);
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
