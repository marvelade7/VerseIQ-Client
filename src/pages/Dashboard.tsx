import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    BookMarked,
    Flame,
    Star,
    TrendingUp,
    Play,
    History,
    ChevronRight,
    Sun,
} from "lucide-react";
import StatCard from "../components/StatCard";
import QuizModal from "../components/QuizModal";

type Difficulty = "easy" | "medium" | "hard" | "mixed";
type Testament = "old" | "new" | "mixed";

const TIME_PER_QUESTION: Record<Difficulty, number> = {
    easy: 5,
    medium: 10,
    hard: 15,
    mixed: 10,
};

const ActionCard = ({
    icon: Icon,
    title,
    description,
    onClick,
    variant = "default",
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    onClick: () => void;
    variant?: "primary" | "default";
}) => (
    <button
        onClick={onClick}
        className={`w-full text-left rounded-2xl p-6 flex items-start gap-4 transition-all duration-200 group border ${
            variant === "primary"
                ? "bg-linear-to-br from-[#7C3AED] to-[#9F67FA] border-transparent text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:-translate-y-0.5"
                : "bg-white border-gray-100 text-gray-800 shadow-sm hover:shadow-md hover:border-[#7C3AED]/30 hover:-translate-y-0.5"
        }`}
    >
        <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                variant === "primary" ? "bg-white/20" : "bg-[#7C3AED]/10"
            }`}
        >
            <Icon
                size={22}
                className={
                    variant === "primary" ? "text-white" : "text-[#7C3AED]"
                }
            />
        </div>
        <div className="flex-1 min-w-0">
            <p
                className={`font-semibold text-base ${variant === "primary" ? "text-white" : "text-gray-900"}`}
            >
                {title}
            </p>
            <p
                className={`text-sm mt-0.5 ${variant === "primary" ? "text-white/70" : "text-gray-500"}`}
            >
                {description}
            </p>
        </div>
        <ChevronRight
            size={18}
            className={`shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-1 ${
                variant === "primary" ? "text-white/60" : "text-gray-300"
            }`}
        />
    </button>
);

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const BIBLE_FACTS = [
    {
        emoji: "📖",
        title: "The Bible has 66 books",
        body: "39 in the Old Testament and 27 in the New Testament, written by over 40 authors across 1,500+ years.",
    },
    {
        emoji: "✍️",
        title: "Most translated book ever",
        body: "The Bible has been fully translated into over 700 languages, with portions available in over 3,000.",
    },
    {
        emoji: "🌍",
        title: "Psalm 117 — the shortest chapter",
        body: "Only 2 verses long. Psalm 119 is the longest at 176 verses. The middle chapter is Psalm 118.",
    },
];



const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [difficulty, setDifficulty] = useState<Difficulty>("easy");
    const [numQuestions, setNumQuestions] = useState<number>(10);
    const [testament, setTestament] = useState<Testament>("mixed");
    const [isStartingQuiz, setIsStartingQuiz] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("verseiq_token");

    useEffect(() => {
    axios
        .get(
            "https://verseiq-server.onrender.com/api/users/dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .catch((err) => {
            if (err.response?.status === 401) {
                localStorage.removeItem("verseiq_token");
                localStorage.removeItem("verseiq_user");
                navigate("/signin");
            }
        });
}, [navigate, token]);

    const handleStartQuiz = () => {
        const categoryMap: Record<Testament, string> = {
            old: "Old Testament",
            new: "New Testament",
            mixed: "mixed",
        };
        const credentials = {
            difficulty,
            count: numQuestions,
            category: categoryMap[testament],
        };
        setIsStartingQuiz(true);
        setError("");
        axios
            .post(
                "https://verseiq-server.onrender.com/api/quiz-sessions/start",
                credentials,
                { headers: { Authorization: `Bearer ${token}` } },
            )
            .then((response) => {
                setIsStartingQuiz(false);
                setShowModal(false);
                navigate("/quiz", {
                    state: {
                        quizSessionId: response.data.data.sessionId,
                        questionIds: response.data.data.questions,
                        timePerQuestion: TIME_PER_QUESTION[difficulty],
                    },
                });
            })
            .catch((err) => {
                console.error("Failed to start quiz:", err.response?.data || err.message);
                setIsStartingQuiz(false);
                setError("Failed to start quiz. Please try again.");
            });
    };

    return (
        <>
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Sun size={14} />
                    <span>{getGreeting()}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 wrap-break-word">
                    {user?.firstName} {user?.lastName} 👋
                </h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Ready to test your Biblical knowledge today?
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6 sm:mb-8">
                <StatCard
                    label="Quizzes Taken"
                    value={user?.totalQuizTaken}
                    icon={BookMarked}
                    subtext="All time"
                />
                <StatCard
                    label="Best Score"
                    value={user?.bestScore}
                    icon={Star}
                    accent="#F59E0B"
                    subtext="Personal record"
                />
                <StatCard
                    label="Longest Streak"
                    value={
                        user?.longestStreak
                            ? `${user.longestStreak} days`
                            : undefined
                    }
                    icon={Flame}
                    accent="#EF4444"
                    subtext="Keep it going!"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 space-y-3">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Quick Actions
                    </h2>
                    <ActionCard
                        icon={Play}
                        title="Start a Quiz"
                        description="Pick difficulty, source & go"
                        onClick={() => setShowModal(true)}
                        variant="primary"
                    />
                    <ActionCard
                        icon={History}
                        title="Quiz History"
                        description="Review your past results"
                        onClick={() => navigate("/history")}
                    />
                    <ActionCard
                        icon={TrendingUp}
                        title="Leaderboard"
                        description="See how you rank globally"
                        onClick={() => navigate("/leaderboard")}
                    />
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Did You Know?
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 h-full">
                        <div className="space-y-4">
                            {BIBLE_FACTS.map((fact, i) => (
                                <div
                                    key={i}
                                    className="flex gap-3 sm:gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                                >
                                    <span className="text-2xl shrink-0">
                                        {fact.emoji}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">
                                            {fact.title}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-0.5">
                                            {fact.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <QuizModal
                    onClose={() => setShowModal(false)}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    numQuestions={numQuestions}
                    setNumQuestions={setNumQuestions}
                    testament={testament}
                    setTestament={setTestament}
                    isStartingQuiz={isStartingQuiz}
                    error={error}
                    onStart={handleStartQuiz}
                />
            )}
        </>
    );
};

export default Dashboard;
