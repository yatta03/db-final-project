export default function AuthFormInput({ label, error, ...props }) {
  return (
    <>
      <div>
        <label>{label}</label>
        <input {...props}></input>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}
