import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "../context/SupabaseProvider";

export default function RolePage() {
  const navigate = useNavigate();
  const { supabase, session } = useSupabase();

  const handelSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error);
    navigate("/user/signIn");
  };
  if (session?.access_token)
    return (
      <>
        <p>Welcome! {JSON.stringify(session.user.email)}</p>
        <p>請選擇身分</p>
        {/* 網址是暫時填的 */}
        <Link to={"/bidder"}>代購者</Link>
        <Link to={"/buyer"}> 買家</Link>
        <br />
        <button onClick={handelSignOut}>Sign out</button>
      </>
    );
  else
    return (
      <>
        <Link to={"/user/signIn"}>Sign in</Link>
      </>
    );
}
