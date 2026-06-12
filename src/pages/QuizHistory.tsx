import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronLeft } from "lucide-react";
import axios from "axios";

interface Option {
    _id: string;
    optionText: string;
    isCorrect: boolean;
}

interface PopulatedQuestion {
    _id: string;
    questionText: string;
    options: Option[];
    reference?: string;
    difficulty: string;
    category: string;
}

interface Answer {
    question: PopulatedQuestion;
    selectedOption: string;
    isCorrect: boolean;
}

interface QuizSession {
    _id: string;
    category: string;
    difficulty: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    accuracy: number;
    timeTaken: number;
    status: string;
    startedAt: string;
    completedAt: string;
    answers: Answer[];
}

const QuizHistory = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("verseiq_token");
    const [sessions, setSessions] = useState<QuizSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<QuizSession | null>(null);

    useEffect(() => {
        axios
            .get("https://verseiq-server.onrender.com/api/quiz-sessions/history", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setSessions(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch history:", err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-[#7C3AED]" size={40} />
            </div>
        );
    }

    // Detail view
    if (selectedSession) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] py-10 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setSelectedSession(null)}
                            className="flex items-center gap-1 text-[#7C3AED] font-medium hover:underline"
                        >
                            <ChevronLeft size={18} /> Back to History
                        </button>
                        <p className="text-sm text-gray-400">
                            {new Date(selectedSession.startedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>

                    {/* Summary bar */}
                    <div className="bg-white shadow-md rounded-xl p-6 mb-6 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-800 capitalize">
                                {selectedSession.category} · {selectedSession.difficulty}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                ✅ {selectedSession.correctAnswers}/{selectedSession.totalQuestions} correct
                                · ⏱ {selectedSession.timeTaken}s
                            </p>
                        </div>
                        <p className={`text-3xl font-bold ${
                            selectedSession.score >= 70
                                ? "text-green-500"
                                : selectedSession.score >= 50
                                  ? "text-yellow-500"
                                  : "text-red-500"
                        }`}>
                            {selectedSession.score}%
                        </p>
                    </div>

                    {/* Questions breakdown */}
                    <div className="flex flex-col gap-4">
                        {selectedSession.answers.map((answer, index) => {
                            const q = answer.question;
                            return (
                                <div
                                    key={q._id}
                                    className={`p-4 rounded-lg border-2 ${
                                        answer.isCorrect
                                            ? "border-green-400 bg-green-50"
                                            : "border-red-400 bg-red-50"
                                    }`}
                                >
                                    <p className="text-sm font-semibold text-gray-800 mb-2">
                                        {index + 1}. {q.questionText}
                                    </p>
                                    {q.options.map((o) => {
                                        const isSelected = o._id === answer.selectedOption;
                                        const isCorrectOption = o.isCorrect;
                                        return (
                                            <p
                                                key={o._id}
                                                className={`text-sm py-1 px-2 rounded mb-1 ${
                                                    isCorrectOption
                                                        ? "bg-green-200 text-green-800 font-medium"
                                                        : isSelected && !isCorrectOption
                                                          ? "bg-red-200 text-red-800 line-through"
                                                          : "text-gray-600"
                                                }`}
                                            >
                                                {o.optionText}
                                                {isCorrectOption && " ✓"}
                                                {isSelected && !isCorrectOption && " ✗"}
                                            </p>
                                        );
                                    })}
                                    {q.reference && (
                                        <p className="text-xs text-gray-400 mt-2 italic">
                                            📖 {q.reference}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // List view
    return (
        <div className="min-h-screen bg-[#F9FAFB] py-10 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-[#7C3AED]">Quiz History</h1>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="border border-[#7C3AED] text-[#7C3AED] py-2 px-4 rounded-md hover:bg-purple-50 transition-colors text-sm font-medium"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {sessions.length === 0 ? (
                    <p className="text-center text-gray-500 mt-20">
                        No quizzes taken yet. Start one!
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {sessions.map((session) => (
                            <div
                                key={session._id}
                                onClick={() => setSelectedSession(session)}
                                className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-[#7C3AED] border-2 border-transparent transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-gray-800 capitalize">
                                            {session.category} · {session.difficulty}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(session.startedAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <p className={`text-2xl font-bold ${
                                        session.score >= 70
                                            ? "text-green-500"
                                            : session.score >= 50
                                              ? "text-yellow-500"
                                              : "text-red-500"
                                    }`}>
                                        {session.score}%
                                    </p>
                                </div>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <span>✅ {session.correctAnswers}/{session.totalQuestions} correct</span>
                                    <span>⏱ {session.timeTaken}s</span>
                                    <span>🎯 {session.accuracy}% accuracy</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizHistory;