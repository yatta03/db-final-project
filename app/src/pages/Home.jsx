import { Link } from "react-router-dom";

export default function Home() {
  const pageStyle = {
    maxWidth: "300px",
    margin: "3rem auto",
    padding: "2rem",
    display: "flex",
    // justifyContent: "center",
    // display: "flex",
    flexDirection: "column",

    // height: "100vh",
    textAlign: "center",
  };

  const buttonStyle = {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    background: " #0077cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <>
      <div style={pageStyle}>
        <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>Welcome!</p>
        <Link to="/user/signIn" style={{ ...buttonStyle, backgroundColor: "#0077cc" }}>
          sign in
        </Link>
        <Link to="/user/signUp" style={{ marginTop: "1rem" }}>
          sign up
        </Link>
      </div>
    </>
  );
}
