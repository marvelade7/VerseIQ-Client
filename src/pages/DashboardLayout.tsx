import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#F8F7FF]">
            <Sidebar />
            <main className="w-full flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:ml-75 lg:p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
