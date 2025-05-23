import AuthFormInput from "./AuthFormInput";

export default function AuthForm({ fields, onSubmit, submitText = "Submit" }) {
  return (
    <>
      <form onSubmit={onSubmit}>
        {fields.map(({ name, label, type, value, onChange, error }) => (
          <AuthFormInput key={name} label={label} type={type} value={value} onChange={onChange} error={error} />
        ))}
        <button type="submit">{submitText}</button>
      </form>
    </>
  );
}
