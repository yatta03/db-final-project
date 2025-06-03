import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import useForm from "../../hooks/useForm";
import AuthForm from "../../components/AuthForm/AuthForm";
import { validateSingUp } from "../../utils/validators";
import "./SignInPage.css";

export default function SignInPage() {
  const { form, errors, handleChange, validateForm } = useForm({ email: "", password: "" }, validateSingUp);
  const navigate = useNavigate();
  const { supabase, session } = useSupabase();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) alert(error.message);
    else navigate("/role");
  };

  const fields = [
    { name: "email", label: "Email", type: "email", value: form.email, onChange: handleChange("email"), error: errors.email },
    { name: "password", label: "Password", type: "password", value: form.password, onChange: handleChange("password"), error: errors.password },
  ];

  const handleTestSignIn = async (account) => {
    const accountList = {
      user1: { email: "test@gmail.com", password: "abcdef" },
      user2: { email: "agent@gmail.com", password: "agent1" },
    };
    const { error } = await supabase.auth.signInWithPassword({ email: accountList[account].email, password: accountList[account].password });
    if (error) alert(error.message);
    else navigate("/role");
  };

  if (session?.access_token)
    return (
      <>
        <p>you've already logged in</p>
        <Link to={"/role"}>select role</Link>
      </>
    );
  else
    return (
      <>
        <div className="auth-signin">
          <button className="auth-alt-button" onClick={() => handleTestSignIn("user1")}>
            登入測試帳號1
          </button>
          <button className="auth-alt-button" onClick={() => handleTestSignIn("user2")}>
            登入測試帳號2
          </button>
          <h2>Sign in</h2>
          <AuthForm fields={fields} onSubmit={handleSignIn} submitText="sign in" />
          <Link to={"/user/signUp"}>Sign up</Link>
        </div>
      </>
    );
}
