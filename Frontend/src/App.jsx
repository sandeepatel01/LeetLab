import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";
import LandingPage from "./page/LandingPage";

const App = () => {
  let authUser = null;

  return (
    <div className="flex flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
