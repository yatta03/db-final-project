import AuthForm from "../AuthForm/AuthForm";
import useForm from "../../hooks/useForm";
import { validateQuotePost } from "../../utils/validators";

export default function QuotePost({ postQuote }) {
  const { form, errors, handleChange, validateForm, resetForm } = useForm({ price: 0 }, validateQuotePost);
  const fields = [{ name: "price", label: "Price", type: "number", min: "0", value: form.price, onChange: handleChange("price"), error: errors.price }];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const res = postQuote(form.price);
    if (res) resetForm();
  };

  return (
    <>
      <AuthForm fields={fields} onSubmit={handleSubmit} submitText="報價" />
    </>
  );
}
