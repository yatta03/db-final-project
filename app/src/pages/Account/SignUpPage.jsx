import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import useForm from "../../hooks/useForm";
import AuthForm from "../../components/AuthForm/AuthForm";
import { validateSingUp } from "../../utils/validators";
import "./SignInPage.css";

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
    { name: "name", label: "姓名", type: "text", value: form.name, onChange: handleChange("name"), error: errors.name },
    { name: "email", label: "Email", type: "email", value: form.email, onChange: handleChange("email"), error: errors.email },
    { name: "password", label: "密碼", type: "password", value: form.password, onChange: handleChange("password"), error: errors.password },
  ];

  if (session?.access_token) {
    return (
      <div className="auth-already-logged">
        <p>您已經登入了</p>
        <Link to={"/role"}>選擇角色</Link>
      </div>
    );
  } else {
    return (
      <div className="auth-signin">
        {/* 註冊表單 */}
        <h2>建立新帳號</h2>
        <p className="signup-description">
          加入我們的代購平台，開始您的全球購物之旅
        </p>
        
        <AuthForm fields={fields} onSubmit={handleSignUp} submitText="立即註冊" />
        
        {/* 登入連結 */}
        <Link to={"/user/signIn"}>已有帳號？立即登入</Link>
      </div>
    );
  }
}
