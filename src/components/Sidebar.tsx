import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    User,
    Trophy,
    History,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { to: "/history", icon: History, label: "History" },
    { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="fixed inset-x-0 bottom-0 z-40 flex items-center bg-white px-2 py-2 shadow-[0_-6px_20px_rgba(15,23,42,0.08)] lg:left-0 lg:right-auto lg:top-0 lg:bottom-auto lg:h-screen lg:w-75 lg:flex-col lg:items-stretch lg:px-0 lg:py-0 lg:pt-5 lg:ps-2 lg:shadow-lg">
            <img
                src="./logo.png"
                alt="Logo"
                className="hidden w-30 ms-3 lg:block"
            />

            {/* Nav */}
            <nav className="flex flex-1 items-center justify-around gap-1 overflow-x-auto lg:block lg:space-y-1 lg:overflow-y-auto lg:px-3 lg:py-6">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium transition-all duration-300 ease-in-out group sm:text-xs lg:w-full lg:flex-none lg:flex-row lg:gap-3 lg:px-3 lg:py-3 lg:text-sm ${
                                isActive
                                    ? "text-[#7C3AED] font-black border-b-2 -translate-y-1 scale-105"
                                    : "text-black hover:text-[#7C3AED] hover:bg-[#7C3AED]/90"
                            }`
                        }
                    >
                        {(
                            { isActive },
                        ) => (
                            <>
                                <Icon size={18} className="shrink-0" />
                                {/* On mobile: only show label when active. On desktop: always show */}
                                <span
                                    className={`truncate lg:block scale-105 ${isActive ? "block" : "hidden"}`}
                                >
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User footer */}
            <button
                onClick={handleLogout}
                aria-label="Log out"
                className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 sm:text-xs lg:hidden"
            >
                <LogOut size={18} />
                <span>Log out</span>
            </button>

            <div className="hidden px-3 py-4 border-t border-white/10 lg:block">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-black text-sm font-medium truncate">
                            {user?.username} 
                            {/* {user?.firstName} {user?.lastName} */}
                        </p>
                        <p className="text-gray-500 text-xs truncate">
                            {user?.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut size={18} />
                    Log out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
