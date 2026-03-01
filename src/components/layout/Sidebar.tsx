import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (user?.role === "client") return null;

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium
    ${isActive
      ? "bg-indigo-600 text-white"
      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed md:relative z-50 h-screen bg-white dark:bg-gray-900 shadow-xl
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "left-0" : "-left-64 md:left-0"}
      `}
      >
        <div className="flex flex-col h-full p-5">

          {/* Top Logo + Collapse */}
          <div className="flex items-center justify-between mb-8">
            {!collapsed && (
              <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                Estate<span className="text-indigo-600">AI</span>
              </h1>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 dark:text-gray-300"
            >
              <i className="fas fa-angle-left"></i>
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
            {!collapsed && (
              <div>
                <p className="font-semibold text-sm dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">

            {user?.role === "superadmin" && (
              <>
                <NavLink to="/superadmin" end className={linkClasses}>
                  <i className="fas fa-chart-line w-5"></i>
                  {!collapsed && "Dashboard"}
                </NavLink>

                <NavLink to="/superadmin/companies" className={linkClasses}>
                  <i className="fas fa-building w-5"></i>
                  {!collapsed && "Companies"}
                </NavLink>

                <NavLink to="/superadmin/agents" className={linkClasses}>
                  <i className="fas fa-user-tie w-5"></i>
                  {!collapsed && "Agents"}
                </NavLink>

                <NavLink to="/superadmin/leads" className={linkClasses}>
                  <i className="fas fa-users w-5"></i>
                  {!collapsed && "Leads"}
                </NavLink>

                <NavLink to="/superadmin/properties" className={linkClasses}>
                  <i className="fas fa-home w-5"></i>
                  {!collapsed && "Properties"}
                </NavLink>
              </>
            )}

            {user?.role === "agent" && (
              <>
                <NavLink to="/agent" end className={linkClasses}>
                  <i className="fas fa-chart-line w-5"></i>
                  {!collapsed && "Dashboard"}
                </NavLink>

                <NavLink to="/agent/leads" className={linkClasses}>
                  <i className="fas fa-users w-5"></i>
                  {!collapsed && "My Leads"}
                </NavLink>

                <NavLink to="/agent/properties" className={linkClasses}>
                  <i className="fas fa-home w-5"></i>
                  {!collapsed && "My Properties"}
                </NavLink>
              </>
            )}
          </nav>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 transition"
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            {!collapsed && "Logout"}
          </button>

        </div>
      </div>
    </>
  );
};

export default Sidebar;