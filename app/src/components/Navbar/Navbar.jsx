// navbar: 放頁面共用的元件(sign out button...)
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { supabase, session, userProfile } = useSupabase();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error);
    navigate("/user/signIn");
  };

  const isAgentPage = location.pathname.startsWith("/agent/");
  const isBuyerPage = location.pathname.startsWith("/buyer/");

  return (
    <>
      <nav className="app-navbar">
        {session?.access_token ? (
          <div className="nav-items">
            {/* show user name */}
            <p style={{ color: "black" }}>{userProfile?.name ? userProfile.name : "已登入"}</p>

            {isAgentPage && (
              <>
                <Link to="/buyer/posted-orders" className="dashboard-button">
                  切換為買家
                </Link>
                <Link to="/agent/browse-orders" className="dashboard-button">
                  訂單列表
                </Link>
                <Link to="/agent/profile" className="dashboard-button">
                  儀表板
                </Link>
              </>
            )}
            {isBuyerPage && (
              <>
                <Link to="/agent/browse-orders" className="dashboard-button">
                  切換為代購者
                </Link>
                <Link to="/buyer/posted-orders" className="dashboard-button">
                  已發布訂單列表
                </Link>
                <Link to="/buyer/profile" className="dashboard-button">
                  儀表板
                </Link>
              </>
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
