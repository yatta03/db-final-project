import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "../context/SupabaseProvider";
import useForm from "../hooks/useForm";
import AuthForm from "../components/AuthForm";
import { validateSingUp } from "../utils/validators";

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

  const handleTestSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email: "test@gmail.com", password: "abcdef" });
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
        <h2>Sign in</h2>
        <AuthForm fields={fields} onSubmit={handleSignIn} submitText="sign in" />
        <button onClick={handleTestSignIn}>登入測試帳號</button>
        <Link to={"/user/signUp"}>Sign up</Link>
      </>
    );
}
