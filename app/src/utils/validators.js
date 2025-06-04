export const validateSingUp = (form) => {
  const errors = {};
  if (!form.email) errors.email = "email required";
  if (!form.password) errors.password = "password required";
  else if (form.password.length < 6) errors.password = "at least 6 character";
  if (!form.name) errors.name = "name required";

  return errors;
};

export const validateQuotePost = (form) => {
  const errors = {};
  if (!form.price) errors.price = "請填入報價金額";
  else if (form.price <= 0) errors.price = "報價金額不能小於等於 0";

  return errors;
}