import { Link, useNavigate } from "react-router-dom";
import { useSupabase } from "../../context/SupabaseProvider";
import useForm from "../../hooks/useForm";
import AuthForm from "../../components/AuthForm/AuthForm";
import { validateSignIn } from "../../utils/validators";
import "./SignInPage.css";

export default function SignInPage() {
  const { form, errors, handleChange, validateForm } = useForm({ email: "", password: "" }, validateSignIn);
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
      <div className="auth-already-logged">
        <p>您已經登入了</p>
        <Link to={"/role"}>選擇角色</Link>
      </div>
    );
  else
    return (
      <div className="auth-signin">
        {/* 測試帳號區域 */}
        <div className="test-accounts">
          <h3>🚀 快速測試</h3>
          <div className="test-accounts-buttons">
            <button className="auth-alt-button" onClick={() => handleTestSignIn("user1")}>
              登入測試帳號1
            </button>
            <button className="auth-alt-button" onClick={() => handleTestSignIn("user2")}>
              登入測試帳號2
            </button>
          </div>
        </div>

        {/* 登入表單 */}
        <h2>登入帳號</h2>
        <AuthForm fields={fields} onSubmit={handleSignIn} submitText="立即登入" />

        {/* 註冊連結 */}
        <Link to={"/user/signUp"}>還沒有帳號？立即註冊</Link>
      </div>
    );
}
