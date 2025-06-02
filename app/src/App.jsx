import { BrowserRouter as Router, Routes, Route } from "react-router";
import { SupabaseProvider } from "./context/SupabaseProvider";
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import RolePage from "./pages/RolePage";

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
          </Routes>
        </Router>
      </SupabaseProvider>
    </>
  );
}

export default App;
