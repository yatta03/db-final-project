import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "../context/SupabaseProvider";
import useForm from "../hooks/useForm";
import AuthForm from "../components/AuthForm";
import { validateSingUp } from "../utils/validators";

export default function SignUpPage() {
  const { form, errors, handleChange, validateForm } = useForm({ email: "", password: "", name: "" }, validateSingUp);
  const navigate = useNavigate();
  const { supabase, session } = useSupabase();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { error } = await supabase.auth.signUp({ ...form, options: { data: { name: form.name } } });
    if (error) alert(error.message);
    else navigate("/role");
  };

  const fields = [
    { name: "name", label: "Name", type: "text", value: form.name, onChange: handleChange("name"), error: errors.name },
    { name: "email", label: "Email", type: "email", value: form.email, onChange: handleChange("email"), error: errors.email },
    { name: "password", label: "Password", type: "password", value: form.password, onChange: handleChange("password"), error: errors.password },
  ];

  if (session?.access_token) {
    return (
      <>
        <p>you've already logged in</p>
        <Link to={"/role"}>select role</Link>
      </>
    );
  } else {
    return (
      <>
        <h2>sign up</h2>
        <AuthForm fields={fields} onSubmit={handleSignUp} submitText="sign up" />
        <Link to={"/user/signIn"}>back to sign in</Link>
      </>
    );
  }
}
