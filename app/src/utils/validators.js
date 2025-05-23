export const validateSingUp = (form) => {
  const errors = {};
  if (!form.email) errors.email = "email required";
  if (!form.password) errors.password = "password required";
  else if (form.password.length < 6) errors.password = "at least 6 character";

  return errors;
};