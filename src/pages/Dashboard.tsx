import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Loader2, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Difficulty = "easy" | "medium" | "hard" | "mixed";
type Testament = "old" | "new" | "mixed";

const TIME_PER_QUESTION: Record<Difficulty, number> = {
    easy: 5,
    medium: 10,
    hard: 15,
    mixed: 10,
};

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

    // automatically calculates total time whenever difficulty or numQuestions changes
    const totalSeconds = TIME_PER_QUESTION[difficulty] * numQuestions;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const timeDisplay =
        remainingSeconds === 0
            ? `${totalMinutes} min`
            : `${totalMinutes} min ${remainingSeconds} sec`;

    const handleStartQuiz = () => {
        const categoryMap: Record<Testament, string> = {
            old: "Old Testament",
            new: "New Testament",
            mixed: "mixed",
        };
        // you'll use these values when calling your quiz API
        let count = numQuestions;
        let category = categoryMap[testament];
        const credentials = { difficulty, count, category };
        setIsStartingQuiz(true);
        axios
            .post(
                // "https://verseiq-server.onrender.com/api/quiz-sessions/start",
                "http://localhost:4576/api/quiz-sessions/start",
                credentials,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((response) => {
                console.log("Quiz started:", response.data);
                console.log("full response.data:", JSON.stringify(response.data));
                setIsStartingQuiz(false);
                setShowModal(false);
                navigate("/quiz", {
                    state: {
                        quizSessionId: response.data.data.sessionId,
                        // sessionId: response.data.data.sessionId,    
                        questionIds: response.data.data.questions,
                        timePerQuestion: TIME_PER_QUESTION[difficulty],
                    },
                });
            })
            .catch((error) => {
                console.error(
                    "Failed to start quiz:",
                    error.response?.data || error.message,
                );
                setIsStartingQuiz(false);
                setError("Failed to start quiz. Please try again.");
                // handle error (e.g., show notification)
            });
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">
                Welcome, {user?.firstName} {user?.lastName} 👋
            </h1>
            <p className="text-center text-gray-600 mt-4">
                This is where you can access your quizzes, track your progress,
                and explore new content.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-6 mt-8">
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">Total Quizzes Taken</p>
                    <p className="text-2xl font-bold text-[#7C3AED]">
                        {user?.totalQuizTaken}
                    </p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">Best Score</p>
                    <p className="text-2xl font-bold text-[#7C3AED]">
                        {user?.bestScore}
                    </p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">Longest Streak</p>
                    <p className="text-2xl font-bold text-[#7C3AED]">
                        {user?.longestStreak}
                    </p>
                </div>
            </div>

            {/* Start Quiz Button */}
            <div className="flex justify-center">
                <button
                    onClick={() => setShowModal(true)} // 👈 opens the modal
                    className="bg-[#7C3AED] text-white py-2 px-4 rounded-md hover:bg-[#6D28D9] transition-colors duration-300 mt-8"
                >
                    Start Quiz
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-[#7C3AED] mb-6">
                            Configure Your Quiz
                        </h2>

                        <div className="mb-6">
                            <p className="font-medium text-gray-700 mb-3">
                                Where do you want your questions to come from?
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {(["old", "new", "mixed"] as Testament[]).map(
                                    (t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTestament(t)}
                                            className={`py-3 px-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                testament === t
                                                    ? "bg-[#7C3AED] text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            }`}
                                        >
                                            {t === "old"
                                                ? "Old Testament"
                                                : t === "new"
                                                  ? "New Testament"
                                                  : "Mixed"}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="font-medium text-gray-700 mb-3">
                                Choose Difficulty Level
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                {(
                                    [
                                        "easy",
                                        "medium",
                                        "hard",
                                        "mixed",
                                    ] as Difficulty[]
                                ).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setDifficulty(level)}
                                        className={`py-2 px-3 rounded-md text-sm font-medium capitalize transition-colors duration-200 ${
                                            difficulty === level
                                                ? "bg-[#7C3AED] text-white" // selected
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200" // not selected
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="font-medium text-gray-700 mb-3 block">
                                Number of Questions:{" "}
                                <span className="text-[#7C3AED] font-bold">
                                    {numQuestions}
                                </span>
                            </label>
                            <input
                                type="range"
                                min={5}
                                max={50}
                                step={5}
                                value={numQuestions}
                                onChange={(e) =>
                                    setNumQuestions(Number(e.target.value))
                                }
                                className="w-full accent-[#7C3AED]"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>5</span>
                                <span>50</span>
                            </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 text-center">
                            <p className="text-sm text-gray-500">
                                Estimated Time
                            </p>
                            <p className="text-2xl font-bold text-[#7C3AED]">
                                {timeDisplay}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {TIME_PER_QUESTION[difficulty]}s per question × {numQuestions} questions
                            </p>
                        </div>

                        <button
                            onClick={handleStartQuiz}
                            disabled={isStartingQuiz}
                            className="bg-[#7C3AED] text-white py-2 w-full rounded-md font-semibold hover:bg-[#6D28D9] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isStartingQuiz ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                "Let's Go"
                            )}
                        </button>
                        {error && (
                            <p className="text-red-500 text-sm text-center mt-4">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
