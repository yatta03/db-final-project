import { BrowserRouter as Router, Routes, Route } from "react-router";
import { SupabaseProvider } from "./context/SupabaseProvider";
import "./App.css";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import SignInPage from "./pages/Account/SignInPage";
import SignUpPage from "./pages/Account/SignUpPage";
import RolePage from "./pages/RolePage";
import OrderDetailPage from "./pages/OrderDetail/OrderDetailPage";
import AgentProfilePage from "./pages/agent/AgentProfilePage";
import AgentAcceptedOrdersPage from "./pages/agent/AgentAcceptedOrdersPage";
import AgentOrderDetailPage from "./pages/agent/AgentOrderDetailPage";

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
            <Route path="/agent/order/:orderId" element={<AgentOrderDetailPage />} />
            <Route path="/agent/profile" element={<AgentProfilePage />} />
            <Route path="/agent/accepted-orders" element={<AgentAcceptedOrdersPage />} />
          </Routes>
        </Router>
      </SupabaseProvider>
    </>
  );
}

export default App;
