import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
    User,
    Mail,
    Lock,
    Save,
    Loader2,
    CheckCircle2,
    BookMarked,
    Star,
    Flame,
} from "lucide-react";

const InputField = ({
    label,
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    disabled = false,
}: {
    label: string;
    icon: React.ElementType;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    disabled?: boolean;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
        </label>
        <div className="relative">
            <Icon
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
        </div>
    </div>
);

const Profile = () => {
    const { user, updateUser } = useAuth();
    const token = localStorage.getItem("verseiq_token");

    const [firstName, setFirstName] = useState(user?.firstName ?? "");
    const [lastName, setLastName] = useState(user?.lastName ?? "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSavingInfo, setIsSavingInfo] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [infoSuccess, setInfoSuccess] = useState("");
    const [infoError, setInfoError] = useState("");
    const [pwSuccess, setPwSuccess] = useState("");
    const [pwError, setPwError] = useState("");

    const handleSaveInfo = () => {
        setInfoError("");
        setInfoSuccess("");
        setIsSavingInfo(true);
        axios
            .put(
                "https://verseiq-server.onrender.com/api/users/profile",
                { firstName, lastName },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            .then((res) => {
                setIsSavingInfo(false);
                setInfoSuccess("Profile updated successfully.");
                if (updateUser) updateUser({ ...user, ...res.data.data });
            })
            .catch((err) => {
                console.log(err.response?.data);

                setInfoError(
                    err.response?.data?.message ||
                        "Failed to update profile. Please try again.",
                );
            });
    };

    const handleSavePassword = () => {
        setPwError("");
        setPwSuccess("");

        if (newPassword !== confirmPassword) {
            setPwError("New passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setPwError("Password must be at least 6 characters.");
            return;
        }

        setIsSavingPassword(true);

        axios
            .put(
                "https://verseiq-server.onrender.com/api/users/profile", // 👈 same endpoint as info update
                { currentPassword, newPassword }, // 👈 exact field names backend expects
                { headers: { Authorization: `Bearer ${token}` } },
            )
            .then(() => {
                setIsSavingPassword(false);
                setPwSuccess("Password changed successfully.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            })
            .catch((err) => {
                setIsSavingPassword(false);
                setPwError(
                    err.response?.data?.error ?? "Failed to change password.",
                );
            });
    };

    return (
        <div>
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Manage your account information and password.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left: avatar + stats */}
                <div className="xl:col-span-1 space-y-4">
                    {/* Avatar card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white text-2xl font-bold mb-4">
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]}
                        </div>
                        <p className="font-bold text-gray-900 text-lg wrap-break-word">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-gray-400 text-sm mt-0.5 break-all">
                            {user?.email}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4">
                        <h3 className="font-semibold text-gray-700 text-sm">
                            Your Stats
                        </h3>
                        {[
                            {
                                icon: BookMarked,
                                label: "Quizzes Taken",
                                value: user?.totalQuizTaken ?? 0,
                                color: "#7C3AED",
                            },
                            {
                                icon: Star,
                                label: "Best Score",
                                value: user?.bestScore ?? 0,
                                color: "#F59E0B",
                            },
                            {
                                icon: Flame,
                                label: "Longest Streak",
                                value: `${user?.longestStreak ?? 0} days`,
                                color: "#EF4444",
                            },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <div
                                key={label}
                                className="flex items-center gap-3"
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${color}15` }}
                                >
                                    <Icon size={16} style={{ color }} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">
                                        {label}
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: forms */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Personal info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <User size={18} className="text-[#7C3AED]" />
                            Personal Information
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="First Name"
                                    icon={User}
                                    value={firstName}
                                    onChange={setFirstName}
                                    placeholder="First name"
                                />
                                <InputField
                                    label="Last Name"
                                    icon={User}
                                    value={lastName}
                                    onChange={setLastName}
                                    placeholder="Last name"
                                />
                            </div>
                            <InputField
                                label="Email"
                                icon={Mail}
                                value={user?.email ?? ""}
                                onChange={() => {}}
                                disabled
                                placeholder="Email address"
                            />
                        </div>

                        {infoSuccess && (
                            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-xl px-4 py-2.5">
                                <CheckCircle2 size={15} /> {infoSuccess}
                            </div>
                        )}
                        {infoError && (
                            <p className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
                                {infoError}
                            </p>
                        )}

                        <button
                            onClick={handleSaveInfo}
                            disabled={isSavingInfo}
                            className="mt-5 flex w-full sm:w-auto items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSavingInfo ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <Save size={15} />
                            )}
                            Save Changes
                        </button>
                    </div>

                    {/* Change password */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                        <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <Lock size={18} className="text-[#7C3AED]" />
                            Change Password
                        </h2>
                        <div className="space-y-4">
                            <InputField
                                label="Current Password"
                                icon={Lock}
                                type="password"
                                value={currentPassword}
                                onChange={setCurrentPassword}
                                placeholder="Enter current password"
                            />
                            <InputField
                                label="New Password"
                                icon={Lock}
                                type="password"
                                value={newPassword}
                                onChange={setNewPassword}
                                placeholder="Enter new password"
                            />
                            <InputField
                                label="Confirm New Password"
                                icon={Lock}
                                type="password"
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                placeholder="Confirm new password"
                            />
                        </div>

                        {pwSuccess && (
                            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-xl px-4 py-2.5">
                                <CheckCircle2 size={15} /> {pwSuccess}
                            </div>
                        )}
                        {pwError && (
                            <p className="mt-4 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2.5">
                                {pwError}
                            </p>
                        )}

                        <button
                            onClick={handleSavePassword}
                            disabled={isSavingPassword}
                            className="mt-5 flex w-full sm:w-auto items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSavingPassword ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <Lock size={15} />
                            )}
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
