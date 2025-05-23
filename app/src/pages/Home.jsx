import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <p>Welcome!</p>
      <Link to="/user/signIn">sign in </Link>
      <Link to="/user/signUp">sign up</Link>
    </>
  );
}
