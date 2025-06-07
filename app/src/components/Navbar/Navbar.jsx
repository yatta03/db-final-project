// navbar: 放頁面共用的元件(sign out button...)
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { supabase, session } = useSupabase();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error);
    navigate("/user/signIn");
  };

  const isAgentPage = location.pathname.startsWith('/agent/');
  const isBuyerPage = location.pathname.startsWith('/buyer/');

  return (
    <>
      <nav className="app-navbar">
        {session?.access_token ? (
          <div className="nav-items">
            {isAgentPage && (
              <Link to="/agent/profile" className="dashboard-button">
                儀表板
              </Link>
            )}
            {isBuyerPage && (
              <Link to="/buyer/profile" className="dashboard-button">
                儀表板
              </Link>
            )}
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <></>
        )}
      </nav>
    </>
  );
}
