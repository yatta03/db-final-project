import { Link } from "react-router-dom";

export default function RolePage() {
  const pageStyle = {
    maxWidth: "300px",
    margin: "3rem auto",
    padding: "2rem",
  };

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "8px",
    color: "white",
    margin: "0 1rem",
  };

  return (
    <>
      <div style={pageStyle}>
        <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>請選擇身分</p>
        <Link to={"/agent/browse-orders"} style={{ ...buttonStyle, backgroundColor: "#444" }}>
          代購者
        </Link>
        <Link to={"/buyer"} style={{ ...buttonStyle, backgroundColor: "#0077cc" }}>
          買家
        </Link>
      </div>
    </>
  );
}
