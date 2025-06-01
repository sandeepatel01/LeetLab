import { useAuthStore } from "../store/useAuthStore";

const LogoutButton = ({ children, className = "" }) => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={onLogout}
      className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 
                 hover:bg-[#441729] hover:text-[#c61352] text-sm font-medium flex items-center ${className}`}
    >
      {children}
    </button>
  );
};

export default LogoutButton;
