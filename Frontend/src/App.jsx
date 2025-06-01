import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import Layout from "./Layout";
import Admin from "./components/Admin";
import AddProblem from "./page/AddProblem";
import HomePage from "./page/HomePage";
import ProblemPage from "./page/ProblemPage";
import LandingPage from "./page/LandingPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route
            path="home"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to="/login" />}
        />
        <Route element={<Admin />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
