export default function AuthFormInput({ label, error, ...props }) {
  return (
    <>
      <div className="auth-input-group">
        <label className="auth-input-label">{label}</label>
        <input className="auth-input" {...props}></input>
        {error && <p className="auth-error">{error}</p>}
      </div>
    </>
  );
}
