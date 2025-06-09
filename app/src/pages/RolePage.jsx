import { Link } from "react-router-dom";
import { useState } from "react";

export default function RolePage() {
  const [hoveredButton, setHoveredButton] = useState(null);
  
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
    padding: "10vh 1rem 0",
  };

  const cardStyle = {
    maxWidth: "350px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
    padding: "2rem",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "1.8rem",
    color: "#333",
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
  };

  const getButtonStyle = (type) => {
    const isHovered = hoveredButton === type;
    const baseStyle = {
      padding: "0.8rem 1.2rem",
      fontSize: "1rem",
      borderRadius: "8px",
      color: "white",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.25s ease",
      boxShadow: isHovered 
        ? "0 6px 12px rgba(0, 0, 0, 0.15)" 
        : "0 3px 6px rgba(0, 0, 0, 0.1)",
      transform: isHovered ? "translateY(-2px)" : "translateY(0)",
    };
    
    if (type === "agent") {
      return {
        ...baseStyle,
        backgroundColor: isHovered ? "#333" : "#444",
      };
    }
    
    return {
      ...baseStyle,
      backgroundColor: isHovered ? "#0066b3" : "#0077cc",
    };
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>请选择身份</h1>
        <div style={buttonContainerStyle}>
          <Link 
            to="/agent/browse-orders" 
            style={getButtonStyle("agent")}
            onMouseEnter={() => setHoveredButton("agent")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            代购者
          </Link>
          <Link 
            to="/buyer/posted-orders" 
            style={getButtonStyle("buyer")}
            onMouseEnter={() => setHoveredButton("buyer")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            买家
          </Link>
        </div>
      </div>
    </div>
  );
}
