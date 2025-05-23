// reusable form with error handling

import { useState } from "react";

export default function useForm(initialVal = {}, validateFn = null) {
  const [form, setForm] = useState(initialVal);
  const [errors, setErrors] = useState({});

  const handleChange = (key) => (e) => {
    const val = e?.target?.value ?? e;
    setForm((prev) => ({ ...prev, [key]: val }));

    // clear error
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    if (!validateFn) return true;
    const newErr = validateFn(form);

    setErrors(newErr);
    return Object.values(newErr).every((err) => !err);
  }

  const resetForm = () => {
    setForm(initialVal);
    setErrors({});
  };

  return { form, errors, setForm, handleChange, validateForm, resetForm };
}