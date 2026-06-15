import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    User,
    Trophy,
    History,
    BookOpen,
    Settings,
    LogOut,
    Zap,
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
        <aside className="fixed left-0 top-0 h-screen w-75 bg-[#ffff] flex flex-col z-40 pt-5 ps-2 shadow-lg">
        {/* // <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F0A1E] flex flex-col z-40">  */}
            {/* Logo */}
            {/* <div className="px-6 py-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                        <Zap size={16} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">
                        Verse<span className="text-[#A78BFA]">IQ</span>
                    </span>
                </div>
            </div> */}
            <img src="./logo.png" alt="Logo" className="md:w-30 w-30 ms-3" />

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? "bg-[#7C3AED] text-white shadow-lg shadow-black-25"
                                    : "text-black hover:text-[#7C3AED] hover:bg-[#7C3AED]/9"
                            }`
                        }
                    >
                        <Icon size={18} className="shrink-0" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User footer */}
            <div className="px-3 py-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-black text-sm font-medium truncate">
                            {user?.firstName} {user?.lastName}
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