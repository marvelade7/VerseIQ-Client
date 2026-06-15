import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#F8F7FF]">
            <Sidebar />
            {/* Page content offset by sidebar width */}
            <main className="ml-75 flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;