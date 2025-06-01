// import { Link } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
// import LogoutButton from "./LogoutButton";
// import { User, Code, LogOut } from "lucide-react";

// const Navbar = () => {
//   const { authUser } = useAuthStore();

//   return (
//     <nav className="sticky top-0 z-50 w-screen ">
//       <div className="flex w-full justify-between items-center bg-black/15 shadow-md shadow-neutral-600/10 backdrop-blur-lg border border-gray-200/10 p-3 md:p-4">
//         <Link to="/" className="flex items-center gap-2">
//           <h1 className="text-xl font-bold text-white">
//             Dev<span className="text-orange-500">Lab</span>
//           </h1>
//         </Link>

//         <div className="hidden md:flex gap-6 text-sm font-medium text-white/80">
//           <Link
//             to="/home"
//             className="hover:text-orange-400 transition-colors duration-200"
//           >
//             Problems
//           </Link>
//           <Link
//             to="/discuss"
//             className="hover:text-orange-400 transition-colors duration-200"
//           >
//             Discuss
//           </Link>
//         </div>

//         {/* Right Side Auth */}
//         <div className="flex items-center gap-4">
//           {!authUser ? (
//             <>
//               <Link
//                 to="/login"
//                 className="text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition"
//               >
//                 Sign In
//               </Link>
//               <Link
//                 to="/signup"
//                 className="text-sm text-white border border-orange-500 hover:bg-orange-500 px-4 py-2 rounded-lg font-medium transition"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <div className="dropdown dropdown-end">
//               <label tabIndex={0} className="cursor-pointer">
//                 <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md border border-white/10">
//                   <img
//                     src={
//                       authUser?.image ||
//                       "https://avatar.iran.liara.run/public/boy"
//                     }
//                     alt="User Avatar"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </label>

//               <ul
//                 tabIndex={0}
//                 className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg
//                   bg-black/70 text-white backdrop-blur-md border border-gray-200/10
//                   rounded-box w-52 space-y-2"
//               >
//                 <li>
//                   <p className="text-sm font-semibold">{authUser?.name}</p>
//                   <hr className="border-gray-300/20" />
//                 </li>
//                 <li>
//                   <Link
//                     to="/profile"
//                     className="hover:bg-orange-500/20 hover:text-orange-400 text-sm font-medium"
//                   >
//                     <User className="w-4 h-4 mr-2" />
//                     My Profile
//                   </Link>
//                 </li>
//                 {authUser?.role === "ADMIN" && (
//                   <li>
//                     <Link
//                       to="/add-problem"
//                       className="hover:bg-orange-500/20 hover:text-orange-400 text-sm font-medium"
//                     >
//                       <Code className="w-4 h-4 mr-2" />
//                       Add Problem
//                     </Link>
//                   </li>
//                 )}
//                 <li>
//                   <LogoutButton className="text-sm font-medium flex items-center">
//                     <LogOut className="w-4 h-4 mr-2" />
//                     Logout
//                   </LogoutButton>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import LogoutButton from "./LogoutButton";
import { User, Code, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-screen bg-black/15 backdrop-blur-lg border border-gray-200/10 shadow-md shadow-neutral-600/10">
      <div className="flex w-full justify-between items-center p-3 md:p-4">
        <Link to="/" className="flex items-center gap-2 ml-4">
          <h1 className="text-xl font-bold text-white">
            Dev<span className="text-orange-500">Lab</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
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

        {/* Mobile Hamburger & Profile Icons */}
        <div className="md:hidden flex items-center gap-4 relative">
          {/* Profile Avatar - show only if logged in */}
          {authUser && (
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="w-10 h-10 rounded-lg overflow-hidden shadow-md border border-white/10 focus:outline-none"
                aria-label="User profile menu"
              >
                <img
                  src={
                    authUser.image || "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <ul
                  className="absolute right-0 mt-2 w-52 p-2 space-y-2 bg-black/70 text-white backdrop-blur-md border border-gray-200/10 rounded-md shadow-lg z-50"
                  tabIndex={0}
                >
                  <li>
                    <p className="text-sm font-semibold">{authUser.name}</p>
                    <hr className="border-gray-300/20" />
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="hover:bg-orange-500/20 hover:text-orange-400 text-sm font-medium block px-2 py-1 rounded"
                    >
                      <User className="inline w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </li>
                  {authUser.role === "ADMIN" && (
                    <li>
                      <Link
                        to="/add-problem"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="hover:bg-orange-500/20 hover:text-orange-400 text-sm font-medium block px-2 py-1 rounded"
                      >
                        <Code className="inline w-4 h-4 mr-2" />
                        Add Problem
                      </Link>
                    </li>
                  )}
                  <li>
                    <LogoutButton
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center text-sm font-medium px-2 py-1 rounded hover:bg-orange-500/20 hover:text-orange-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </LogoutButton>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* Hamburger Icon */}
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Right Side Auth (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {!authUser ? (
            <>
              <Link
                to="/login"
                className="text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm text-white border border-orange-500 hover:bg-orange-500 px-4 py-2 rounded-lg font-medium transition"
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
                  <LogoutButton className="text-sm font-medium flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu (dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-gray-200/10 text-white p-4 space-y-4">
          <div className="flex flex-col gap-4">
            <Link
              to="/home"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-400 text-lg font-medium"
            >
              Problems
            </Link>
            <Link
              to="/discuss"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-orange-400 text-lg font-medium"
            >
              Discuss
            </Link>

            {!authUser ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-medium text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white border border-orange-500 hover:bg-orange-500 px-4 py-2 rounded-lg font-medium text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-orange-400 text-lg font-medium"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </Link>
                {authUser.role === "ADMIN" && (
                  <Link
                    to="/add-problem"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 hover:text-orange-400 text-lg font-medium"
                  >
                    <Code className="w-5 h-5" />
                    Add Problem
                  </Link>
                )}
                <LogoutButton
                  className="flex items-center gap-2 text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </LogoutButton>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
