import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import { User, Code, LogOut } from "lucide-react";

const Navbar = () => {
  const { authUser } = useAuthStore();

  const location = useLocation();
  const hideNavbar = ["/home", "/discuss"];

  if (hideNavbar.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-6">
      <div className="flex w-full justify-between items-center mx-auto max-w-6xl bg-black/15 shadow-md shadow-neutral-600/10 backdrop-blur-lg border border-gray-200/10 p-3 md:p-4 rounded-2xl">
        <Link to="/" className="flex items-center gap-2">
          {/* <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" /> */}
          <h1 className="text-xl font-bold text-white">
            Dev<span className="text-orange-500">Lab</span>
          </h1>
        </Link>

        <div className="hidden md:flex gap-6 text-sm font-medium text-white/80">
          <Link
            to="/home"
            className="hover:text-orange-400 transition-colors duration-200"
          >
            Problems
          </Link>
          <Link
            to="/discuss"
            className="hover:text-orange-400 transition-colors duration-200"
          >
            Discuss
          </Link>
        </div>

        {/* Right Side Auth */}
        <div className="flex items-center gap-4">
          {!authUser ? (
            <>
              <Link
                to="/login"
                className="text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg  font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm text-white border border-orange-500 hover:bg-orange-500 px-4 py-2 rounded-lg  font-medium transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="cursor-pointer">
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md border border-white/10">
                  <img
                    src={
                      authUser?.image ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg 
               bg-black/70 text-white backdrop-blur-md border border-gray-200/10 
               rounded-box w-52 space-y-2"
              >
                <li>
                  <p className="text-sm font-semibold">{authUser?.name}</p>
                  <hr className="border-gray-300/20" />
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-orange-500/20 hover:text-orange-400 text-sm font-medium"
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </li>
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="hover:bg-orange-500/20 hover:text-orange-400 text-sm font-medium"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Add Problem
                    </Link>
                  </li>
                )}
                <li>
                  <LogoutButton className=" text-sm font-medium flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
