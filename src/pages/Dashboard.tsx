// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { Loader2, X } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// type Difficulty = "easy" | "medium" | "hard" | "mixed";
// type Testament = "old" | "new" | "mixed";

// const TIME_PER_QUESTION: Record<Difficulty, number> = {
//     easy: 5,
//     medium: 10,
//     hard: 15,
//     mixed: 10,
// };

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { user } = useAuth();
//     const [showModal, setShowModal] = useState(false);
//     const [difficulty, setDifficulty] = useState<Difficulty>("easy");
//     const [numQuestions, setNumQuestions] = useState<number>(10);
//     const [testament, setTestament] = useState<Testament>("mixed");
//     const [isStartingQuiz, setIsStartingQuiz] = useState(false);
//     const [error, setError] = useState("");

//     const token = localStorage.getItem("verseiq_token");

//     // automatically calculates total time whenever difficulty or numQuestions changes
//     const totalSeconds = TIME_PER_QUESTION[difficulty] * numQuestions;
//     const totalMinutes = Math.floor(totalSeconds / 60);
//     const remainingSeconds = totalSeconds % 60;
//     const timeDisplay =
//         remainingSeconds === 0
//             ? `${totalMinutes} min`
//             : `${totalMinutes} min ${remainingSeconds} sec`;

//     const handleStartQuiz = () => {
//         const categoryMap: Record<Testament, string> = {
//             old: "Old Testament",
//             new: "New Testament",
//             mixed: "mixed",
//         };
//         let count = numQuestions;
//         let category = categoryMap[testament];
//         const credentials = { difficulty, count, category };
//         setIsStartingQuiz(true);
//         axios
//             .post(
//                 "https://verseiq-server.onrender.com/api/quiz-sessions/start",
//                 // "http://localhost:4576/api/quiz-sessions/start",
//                 credentials,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 },
//             )
//             .then((response) => {
//                 // console.log("Quiz started:", response.data);
//                 // console.log("full response.data:", JSON.stringify(response.data));
//                 setIsStartingQuiz(false);
//                 setShowModal(false);
//                 navigate("/quiz", {
//                     state: {
//                         quizSessionId: response.data.data.sessionId,
//                         questionIds: response.data.data.questions,
//                         timePerQuestion: TIME_PER_QUESTION[difficulty],
//                     },
//                 });
//             })
//             .catch((error) => {
//                 console.error(
//                     "Failed to start quiz:",
//                     error.response?.data || error.message,
//                 );
//                 setIsStartingQuiz(false);
//                 setError("Failed to start quiz. Please try again.");
//             });
//     };

//     return (
//         <div>
//             <h1 className="text-3xl font-bold text-center mt-10">
//                 Welcome, {user?.firstName} {user?.lastName} 👋
//             </h1>
//             <p className="text-center text-gray-600 mt-4">
//                 This is where you can access your quizzes, track your progress,
//                 and explore new content.
//             </p>

//             {/* Stats */}
//             <div className="flex justify-center gap-6 mt-8">
//                 <div className="bg-white shadow-md rounded-lg p-6 text-center">
//                     <p className="text-gray-500 text-sm">Total Quizzes Taken</p>
//                     <p className="text-2xl font-bold text-[#7C3AED]">
//                         {user?.totalQuizTaken}
//                     </p>
//                 </div>
//                 <div className="bg-white shadow-md rounded-lg p-6 text-center">
//                     <p className="text-gray-500 text-sm">Best Score</p>
//                     <p className="text-2xl font-bold text-[#7C3AED]">
//                         {user?.bestScore}
//                     </p>
//                 </div>
//                 <div className="bg-white shadow-md rounded-lg p-6 text-center">
//                     <p className="text-gray-500 text-sm">Longest Streak</p>
//                     <p className="text-2xl font-bold text-[#7C3AED]">
//                         {user?.longestStreak}
//                     </p>
//                 </div>
//             </div>

//             {/* Start Quiz Button */}
//             <div className="flex justify-center gap-4">
//                 <button
//                     onClick={() => setShowModal(true)}
//                     className="bg-[#7C3AED] cursor-pointer text-white py-2 px-4 rounded-md hover:bg-[#6D28D9] transition-colors duration-300 mt-8"
//                 >
//                     Start Quiz
//                 </button>
//                 <button
//                     onClick={() => navigate("/history")}
//                     className="border border-[#7C3AED] cursor-pointer text-[#7C3AED] py-2 px-4 rounded-md hover:bg-purple-50 transition-colors duration-300 mt-8"
//                 >
//                     Quiz History
//                 </button>
//             </div>

//             {/* Modal */}
//             {showModal && (
//                 <div
//                     className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
//                     onClick={() => setShowModal(false)}
//                 >
//                     <div
//                         className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-4 relative"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <button
//                             onClick={() => setShowModal(false)}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//                         >
//                             <X size={20} />
//                         </button>

//                         <h2 className="text-xl font-bold text-[#7C3AED] mb-6">
//                             Configure Your Quiz
//                         </h2>

//                         <div className="mb-6">
//                             <p className="font-medium text-gray-700 mb-3">
//                                 Where do you want your questions to come from?
//                             </p>
//                             <div className="grid grid-cols-3 gap-2">
//                                 {(["old", "new", "mixed"] as Testament[]).map(
//                                     (t) => (
//                                         <button
//                                             key={t}
//                                             onClick={() => setTestament(t)}
//                                             className={`py-3 px-2 rounded-md text-sm font-medium transition-colors duration-200 ${
//                                                 testament === t
//                                                     ? "bg-[#7C3AED] text-white"
//                                                     : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                                             }`}
//                                         >
//                                             {t === "old"
//                                                 ? "Old Testament"
//                                                 : t === "new"
//                                                   ? "New Testament"
//                                                   : "Mixed"}
//                                         </button>
//                                     ),
//                                 )}
//                             </div>
//                         </div>

//                         <div className="mb-6">
//                             <p className="font-medium text-gray-700 mb-3">
//                                 Choose Difficulty Level
//                             </p>
//                             <div className="grid grid-cols-4 gap-2">
//                                 {(
//                                     [
//                                         "easy",
//                                         "medium",
//                                         "hard",
//                                         "mixed",
//                                     ] as Difficulty[]
//                                 ).map((level) => (
//                                     <button
//                                         key={level}
//                                         onClick={() => setDifficulty(level)}
//                                         className={`py-2 px-3 rounded-md text-sm font-medium capitalize transition-colors duration-200 ${
//                                             difficulty === level
//                                                 ? "bg-[#7C3AED] text-white" // selected
//                                                 : "bg-gray-100 text-gray-600 hover:bg-gray-200" // not selected
//                                         }`}
//                                     >
//                                         {level}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="mb-6">
//                             <label className="font-medium text-gray-700 mb-3 block">
//                                 Number of Questions:{" "}
//                                 <span className="text-[#7C3AED] font-bold">
//                                     {numQuestions}
//                                 </span>
//                             </label>
//                             <input
//                                 type="range"
//                                 min={5}
//                                 max={50}
//                                 step={5}
//                                 value={numQuestions}
//                                 onChange={(e) =>
//                                     setNumQuestions(Number(e.target.value))
//                                 }
//                                 className="w-full accent-[#7C3AED]"
//                             />
//                             <div className="flex justify-between text-xs text-gray-400 mt-1">
//                                 <span>5</span>
//                                 <span>50</span>
//                             </div>
//                         </div>

//                         <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-center">
//                             <p className="text-sm text-gray-500">
//                                 Estimated Time
//                             </p>
//                             <p className="text-2xl font-bold text-[#7C3AED]">
//                                 {timeDisplay}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-1">
//                                 {TIME_PER_QUESTION[difficulty]}s per question ×{" "}
//                                 {numQuestions} questions
//                             </p>
//                         </div>

//                         <button
//                             onClick={handleStartQuiz}
//                             disabled={isStartingQuiz}
//                             className="bg-[#7C3AED] text-white py-2 w-full rounded-md font-semibold hover:bg-[#6D28D9] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                         >
//                             {isStartingQuiz ? (
//                                 <>
//                                     <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                                     Starting...
//                                 </>
//                             ) : (
//                                 "Let's Go"
//                             )}
//                         </button>
//                         {error && (
//                             <p className="text-red-500 text-sm text-center mt-4">
//                                 {error}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dashboard;

import { useState } from "react";
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
                className={variant === "primary" ? "text-white" : "text-[#7C3AED]"}
            />
        </div>
        <div className="flex-1 min-w-0">
            <p className={`font-semibold text-base ${variant === "primary" ? "text-white" : "text-gray-900"}`}>
                {title}
            </p>
            <p className={`text-sm mt-0.5 ${variant === "primary" ? "text-white/70" : "text-gray-500"}`}>
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
            <div className="mb-8">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <Sun size={14} />
                    <span>{getGreeting()}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName} 👋
                </h1>
                <p className="text-gray-500 mt-1">
                    Ready to test your Biblical knowledge today?
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
                    value={user?.longestStreak ? `${user.longestStreak} days` : undefined}
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
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
                        <div className="space-y-4">
                            {BIBLE_FACTS.map((fact, i) => (
                                <div
                                    key={i}
                                    className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                                >
                                    <span className="text-2xl shrink-0">{fact.emoji}</span>
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