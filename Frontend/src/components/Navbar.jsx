import { User, Code, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full py-4 px-6">
      <div className="flex w-full justify-between items-center mx-auto max-w-6xl bg-black/15 shadow-md shadow-neutral-600/10 backdrop-blur-lg border border-gray-200/10 p-3 md:p-4 rounded-2xl">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            {/* <img src="/logo.png" alt="DevLab Logo" className="w-6 h-6 object-contain" /> */}
            <h1 className="text-xl font-bold text-white">
              Dev<span className="text-orange-500">Lab</span>
            </h1>
          </Link>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-medium text-white/80">
          <Link
            to="/problems"
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

        {/* Right: Avatar Dropdown */}
        <div className="flex items-center gap-6">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover"
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
