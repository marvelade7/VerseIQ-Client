import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Moon,
    Globe,
    Shield,
    Trash2,
    LogOut,
    ChevronRight,
    Check,
    AlertTriangle,
    Volume2,
    Eye,
    EyeOff,
} from "lucide-react";

// ── Reusable primitives ──────────────────────────────────────────────────────

const Toggle = ({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
}) => (
    <button
        onClick={() => onChange(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 ${
            enabled ? "bg-[#7C3AED]" : "bg-gray-200"
        }`}
    >
        <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                enabled ? "translate-x-5" : "translate-x-0"
            }`}
        />
    </button>
);

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
    <div className="mb-5">
        <h2 className="font-bold text-gray-900 text-base">{title}</h2>
        <p className="text-sm text-gray-400 mt-0.5">{description}</p>
    </div>
);

const SettingRow = ({
    icon: Icon,
    iconColor = "#7C3AED",
    label,
    description,
    children,
    danger = false,
}: {
    icon: React.ElementType;
    iconColor?: string;
    label: string;
    description?: string;
    children?: React.ReactNode;
    danger?: boolean;
}) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-3">
            <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: danger ? "#FEF2F2" : `${iconColor}15` }}
            >
                <Icon size={16} style={{ color: danger ? "#EF4444" : iconColor }} />
            </div>
            <div>
                <p className={`text-sm font-medium ${danger ? "text-red-500" : "text-gray-800"}`}>
                    {label}
                </p>
                {description && (
                    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                )}
            </div>
        </div>
        <div className="shrink-0 ml-4">{children}</div>
    </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-2 mb-6">
        {children}
    </div>
);

// ── Select dropdown ───────────────────────────────────────────────────────────

const SelectField = ({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] bg-white"
    >
        {options.map((o) => (
            <option key={o.value} value={o.value}>
                {o.label}
            </option>
        ))}
    </select>
);

// ── Delete account modal ──────────────────────────────────────────────────────

const DeleteModal = ({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) => (
    <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onCancel}
    >
        <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle size={26} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">Delete Account</h3>
            <p className="text-gray-500 text-sm text-center mt-2">
                This will permanently delete your account, all quiz history, and stats.
                This action <span className="font-semibold text-gray-800">cannot be undone</span>.
            </p>
            <div className="flex gap-3 mt-7">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-md shadow-red-100"
                >
                    Yes, delete
                </button>
            </div>
        </div>
    </div>
);

// ── Saved toast ───────────────────────────────────────────────────────────────

const SavedToast = ({ visible }: { visible: boolean }) => (
    <div
        className={`fixed bottom-6 right-6 flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl transition-all duration-300 z-50 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
    >
        <Check size={15} className="text-green-400" />
        Preferences saved
    </div>
);

// ── Main Settings page ────────────────────────────────────────────────────────

const Settings = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Notification prefs
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [quizReminders, setQuizReminders] = useState(true);
    const [leaderboardAlerts, setLeaderboardAlerts] = useState(false);

    // Appearance
    const [darkMode, setDarkMode] = useState(false);
    const [fontSize, setFontSize] = useState("medium");

    // Quiz prefs
    const [soundEffects, setSoundEffects] = useState(true);
    const [showAnswerExplanations, setShowAnswerExplanations] = useState(true);
    const [defaultDifficulty, setDefaultDifficulty] = useState("easy");
    const [defaultTestament, setDefaultTestament] = useState("mixed");

    // Privacy
    const [profileVisible, setProfileVisible] = useState(true);
    const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);

    // UI state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    const showSavedToast = () => {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2500);
    };

    const handleToggle = (setter: (v: boolean) => void) => (v: boolean) => {
        setter(v);
        showSavedToast();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleDeleteAccount = () => {
        // Wire up your delete API call here
        setShowDeleteModal(false);
        logout();
        navigate("/login");
    };

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your preferences and account options.</p>
            </div>

            {/* ── Notifications ── */}
            <Card>
                <div className="pt-4">
                    <SectionHeader
                        title="Notifications"
                        description="Choose what updates you want to receive."
                    />
                </div>
                <SettingRow
                    icon={Bell}
                    label="Email Notifications"
                    description="Receive updates and news via email"
                >
                    <Toggle enabled={emailNotifs} onChange={handleToggle(setEmailNotifs)} />
                </SettingRow>
                <SettingRow
                    icon={Bell}
                    label="Quiz Reminders"
                    description="Get reminded to keep your streak alive"
                >
                    <Toggle enabled={quizReminders} onChange={handleToggle(setQuizReminders)} />
                </SettingRow>
                <SettingRow
                    icon={Bell}
                    label="Leaderboard Alerts"
                    description="Know when your rank changes"
                >
                    <Toggle
                        enabled={leaderboardAlerts}
                        onChange={handleToggle(setLeaderboardAlerts)}
                    />
                </SettingRow>
            </Card>

            {/* ── Appearance ── */}
            <Card>
                <div className="pt-4">
                    <SectionHeader
                        title="Appearance"
                        description="Customize how VerseIQ looks for you."
                    />
                </div>
                <SettingRow
                    icon={Moon}
                    label="Dark Mode"
                    description="Switch to a darker color scheme"
                >
                    <Toggle enabled={darkMode} onChange={handleToggle(setDarkMode)} />
                </SettingRow>
                <SettingRow
                    icon={Globe}
                    label="Font Size"
                    description="Adjust text size across the app"
                >
                    <SelectField
                        value={fontSize}
                        onChange={(v) => { setFontSize(v); showSavedToast(); }}
                        options={[
                            { value: "small", label: "Small" },
                            { value: "medium", label: "Medium" },
                            { value: "large", label: "Large" },
                        ]}
                    />
                </SettingRow>
            </Card>

            {/* ── Quiz Preferences ── */}
            <Card>
                <div className="pt-4">
                    <SectionHeader
                        title="Quiz Preferences"
                        description="Set your default quiz settings."
                    />
                </div>
                <SettingRow
                    icon={Volume2}
                    label="Sound Effects"
                    description="Play sounds on correct and wrong answers"
                >
                    <Toggle enabled={soundEffects} onChange={handleToggle(setSoundEffects)} />
                </SettingRow>
                <SettingRow
                    icon={Eye}
                    label="Show Answer Explanations"
                    description="Display explanations after each question"
                >
                    <Toggle
                        enabled={showAnswerExplanations}
                        onChange={handleToggle(setShowAnswerExplanations)}
                    />
                </SettingRow>
                <SettingRow
                    icon={Globe}
                    label="Default Difficulty"
                    description="Pre-select a difficulty when starting a quiz"
                >
                    <SelectField
                        value={defaultDifficulty}
                        onChange={(v) => { setDefaultDifficulty(v); showSavedToast(); }}
                        options={[
                            { value: "easy", label: "Easy" },
                            { value: "medium", label: "Medium" },
                            { value: "hard", label: "Hard" },
                            { value: "mixed", label: "Mixed" },
                        ]}
                    />
                </SettingRow>
                <SettingRow
                    icon={Globe}
                    label="Default Testament"
                    description="Pre-select a source when starting a quiz"
                >
                    <SelectField
                        value={defaultTestament}
                        onChange={(v) => { setDefaultTestament(v); showSavedToast(); }}
                        options={[
                            { value: "old", label: "Old Testament" },
                            { value: "new", label: "New Testament" },
                            { value: "mixed", label: "Mixed" },
                        ]}
                    />
                </SettingRow>
            </Card>

            {/* ── Privacy ── */}
            <Card>
                <div className="pt-4">
                    <SectionHeader
                        title="Privacy"
                        description="Control your visibility to other players."
                    />
                </div>
                <SettingRow
                    icon={Eye}
                    label="Public Profile"
                    description="Allow others to view your profile"
                >
                    <Toggle enabled={profileVisible} onChange={handleToggle(setProfileVisible)} />
                </SettingRow>
                <SettingRow
                    icon={EyeOff}
                    label="Show on Leaderboard"
                    description="Appear in the global rankings"
                >
                    <Toggle
                        enabled={showOnLeaderboard}
                        onChange={handleToggle(setShowOnLeaderboard)}
                    />
                </SettingRow>
            </Card>

            {/* ── Account ── */}
            <Card>
                <div className="pt-4">
                    <SectionHeader
                        title="Account"
                        description="Manage your session and account data."
                    />
                </div>
                <SettingRow
                    icon={Shield}
                    label="Privacy Policy"
                    description="Read how we handle your data"
                >
                    <button
                        onClick={() => window.open("/privacy", "_blank")}
                        className="flex items-center gap-1 text-sm text-[#7C3AED] font-medium hover:underline"
                    >
                        View <ChevronRight size={14} />
                    </button>
                </SettingRow>
                <SettingRow
                    icon={LogOut}
                    iconColor="#6B7280"
                    label="Log Out"
                    description="Sign out of your account"
                >
                    <button
                        onClick={handleLogout}
                        className="text-sm font-semibold text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors"
                    >
                        Log out
                    </button>
                </SettingRow>
                <SettingRow
                    icon={Trash2}
                    label="Delete Account"
                    description="Permanently remove your account and all data"
                    danger
                >
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        Delete
                    </button>
                </SettingRow>
            </Card>

            {showDeleteModal && (
                <DeleteModal
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteAccount}
                />
            )}

            <SavedToast visible={toastVisible} />
        </>
    );
};

export default Settings;