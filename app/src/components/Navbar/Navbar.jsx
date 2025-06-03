// navbar: 放頁面共用的元件(sign out button...)
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { supabase, session } = useSupabase();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error);
    navigate("/user/signIn");
  };

  return (
    <>
      <nav className="app-navbar">
        {session?.access_token ? (
          <>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <></>
        )}
      </nav>
    </>
  );
}
