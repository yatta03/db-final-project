import { Link } from "react-router-dom";

export default function Home() {
  const pageStyle = {
    maxWidth: "800px",
    margin: "1rem auto",
    padding: "1rem",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#333",
    marginBottom: "0.5rem",
  };

  const subtitleStyle = {
    fontSize: "0.95rem",
    color: "#666",
    marginBottom: "1rem",
    lineHeight: "1.4",
  };

  const featuresStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    margin: "1rem 0",
  };

  const featureStyle = {
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    color: "#333",
  };

  const featureIconStyle = {
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
  };

  const featureTitleStyle = {
    fontSize: "0.9rem",
    margin: "0 0 0.5rem 0",
    fontWeight: "600",
    color: "#333",
  };

  const featureTextStyle = {
    fontSize: "0.75rem",
    margin: 0,
    lineHeight: "1.3",
    color: "#666",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "0.8rem",
    justifyContent: "center",
    marginTop: "1rem",
    flexWrap: "wrap",
  };

  const primaryButtonStyle = {
    padding: "0.6rem 1.2rem",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    border: "none",
    cursor: "pointer",
  };

  const secondaryButtonStyle = {
    padding: "0.6rem 1.2rem",
    backgroundColor: "transparent",
    color: "#007bff",
    textDecoration: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    border: "1px solid #007bff",
    cursor: "pointer",
  };

  const logoStyle = {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  };

  const infoBoxStyle = {
    marginTop: "1rem",
    padding: "0.8rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    border: "1px solid #e9ecef",
    color: "#666",
  };

  const infoTitleStyle = {
    margin: "0 0 0.4rem 0", 
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#333",
  };

  const infoTextStyle = {
    margin: 0, 
    fontSize: "0.75rem",
    lineHeight: "1.3",
    color: "#666",
  };

  return (
    <div style={pageStyle}>
      {/* Logo/Icon */}
      <div style={logoStyle}>🛒</div>
      
      {/* Main Title */}
      <h1 style={titleStyle}>全球代購平台</h1>
      
      {/* Subtitle */}
      <p style={subtitleStyle}>
        連接世界各地的代購需求與代購者，讓跨國購物變得簡單、安全、便捷
      </p>

      {/* Features */}
      <div style={featuresStyle}>
        <div style={featureStyle}>
          <div style={featureIconStyle}>📦</div>
          <h3 style={featureTitleStyle}>發布需求</h3>
          <p style={featureTextStyle}>輕鬆發布您的代購需求，描述商品詳情</p>
        </div>
        
        <div style={featureStyle}>
          <div style={featureIconStyle}>🌍</div>
          <h3 style={featureTitleStyle}>全球代購</h3>
          <p style={featureTextStyle}>覆蓋各國的專業代購者為您服務</p>
        </div>
        
        <div style={featureStyle}>
          <div style={featureIconStyle}>💰</div>
          <h3 style={featureTitleStyle}>透明報價</h3>
          <p style={featureTextStyle}>多重報價比較，選擇最優惠的方案</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={buttonContainerStyle}>
        <Link 
          to="/user/signIn" 
          style={primaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007bff";
          }}
        >
          立即登入
        </Link>
        
        <Link 
          to="/user/signUp" 
          style={secondaryButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#007bff";
          }}
        >
          免費註冊
        </Link>
      </div>

      {/* Additional Info */}
      <div style={infoBoxStyle}>
        <h4 style={infoTitleStyle}>💡 如何開始？</h4>
        <p style={infoTextStyle}>
          註冊帳號 → 選擇角色（買家/代購者）→ 開始發布需求或接取訂單
        </p>
      </div>
    </div>
  );
}
