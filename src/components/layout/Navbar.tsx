import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      <h1 className="text-xl font-semibold text-gray-800">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <div className="text-right">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;