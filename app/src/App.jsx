import { BrowserRouter as Router, Routes, Route } from "react-router";
import { SupabaseProvider } from "./context/SupabaseProvider";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import SignInPage from "./pages/Account/SignInPage";
import SignUpPage from "./pages/Account/SignUpPage";
import RolePage from "./pages/RolePage";
import OrderDetailPage from "./pages/OrderDetail/OrderDetailPage";
import AgentProfilePage from "./pages/AgentProfilePage";

function App() {
  return (
    <>
      <SupabaseProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/signIn" element={<SignInPage />} />
            <Route path="/user/signUp" element={<SignUpPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/buyer/order/:orderId" element={<OrderDetailPage role={"buyer"} />} />
            <Route path="/agent/order/:orderId" element={<OrderDetailPage role={"agent"} />} />
            <Route path="/agent/profile" element={<AgentProfilePage />} />
          </Routes>
        </Router>
      </SupabaseProvider>
    </>
  );
}

export default App;
