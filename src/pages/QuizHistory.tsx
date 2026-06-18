import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Loader2,
    History as HistoryIcon,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    BookOpen,
} from "lucide-react";
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

// ── Reusable sub-components ───────────────────────────────────────────────────

const DifficultyBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
        easy: "text-green-700 text-[.9em]",
        medium: "text-gray-700 text-[.9em]",
        hard: "text-orange-600 text-[.9em]",
        mixed: "text-purple-700 text-[.9em]",
    };
    return (
        <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                colors[level] ?? "bg-gray-100 text-gray-600"
            }`}
        >
            {level}
        </span>
    );
};

const ScoreRing = ({ pct }: { pct: number }) => {
    const color = pct >= 70 ? "#10B981" : pct >= 50 ? "#F59E0B" : "#FF0000";
    return (
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ border: `3px solid ${color}`, color }}
        >
            {pct}%
        </div>
    );
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const SessionDetail = ({
    session,
    onBack,
}: {
    session: QuizSession;
    onBack: () => void;
}) => (
    <div>
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-[#7C3AED] font-medium hover:underline"
            >
                <ChevronLeft size={18} /> Back to History
            </button>
            <p className="text-sm text-gray-400">
                {formatDate(session.startedAt)}
            </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
                { label: "Score", value: `${session.score}%` },
                {
                    label: "Correct",
                    value: `${session.correctAnswers}/${session.totalQuestions}`,
                },
                { label: "Accuracy", value: `${session.accuracy}%` },
                { label: "Time", value: formatTime(session.timeTaken) },
            ].map(({ label, value }) => (
                <div
                    key={label}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm text-center"
                >
                    <p className="text-xl sm:text-2xl font-bold text-[#7C3AED]">{value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                </div>
            ))}
        </div>

        {/* Category + difficulty */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3 mb-6">
            <p className="font-semibold text-gray-800 capitalize flex-1">
                {session.category}
            </p>
            <DifficultyBadge level={session.difficulty} />
            {session.score >= 70 ? (
                <CheckCircle2 size={20} className="text-green-500" />
            ) : (
                <XCircle size={20} className="text-red-400" />
            )}
        </div>

        {/* Answer breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                <BookOpen size={18} className="text-[#7C3AED]" />
                <h2 className="font-semibold text-gray-800">
                    Answer Breakdown
                </h2>
                <span className="ml-auto text-xs text-gray-400">
                    {session.answers.length} questions
                </span>
            </div>

            <div className="divide-y divide-gray-50">
                {session.answers.map((answer, index) => {
                    const q = answer.question;
                    return (
                        <div
                            key={q._id}
                            className={`px-4 sm:px-6 py-4 ${
                                answer.isCorrect ? "bg-green-50" : "bg-red-50"
                            }`}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                {answer.isCorrect ? (
                                    <CheckCircle2
                                        size={18}
                                        className="text-green-500 mt-0.5 shrink-0"
                                    />
                                ) : (
                                    <XCircle
                                        size={18}
                                        className="text-red-400 mt-0.5 shrink-0"
                                    />
                                )}
                                <p className="text-sm font-semibold text-gray-800">
                                    {index + 1}. {q.questionText}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 pl-0 sm:pl-7">
                                {q.options.map((o) => {
                                    const isSelected =
                                        o._id === answer.selectedOption;
                                    const isCorrectOption = o.isCorrect;
                                    return (
                                        <p
                                            key={o._id}
                                            className={`text-sm py-1 px-3 rounded ${
                                                isCorrectOption
                                                    ? "bg-green-200 text-green-800 font-medium"
                                                    : isSelected &&
                                                        !isCorrectOption
                                                      ? "bg-red-200 text-red-800 line-through"
                                                      : "text-gray-500"
                                            }`}
                                        >
                                            {o.optionText}
                                            {isCorrectOption && " ✓"}
                                            {isSelected &&
                                                !isCorrectOption &&
                                                " ✗"}
                                        </p>
                                    );
                                })}
                            </div>

                            {q.reference && (
                                <p className="text-xs text-gray-400 mt-2 italic pl-0 sm:pl-7">
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

// ── Main component ────────────────────────────────────────────────────────────

const QuizHistory = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("verseiq_token");
    const [sessions, setSessions] = useState<QuizSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSession, setSelectedSession] = useState<QuizSession | null>(
        null,
    );
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<
        "all" | "passed" | "failed" | "average"
    >("all");

    useEffect(() => {
        axios
            .get(
                "https://verseiq-server.onrender.com/api/quiz-sessions/history",
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            .then((res) => {
                setSessions(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("Failed to fetch history:", err);
                setIsLoading(false);
            });
    }, []);

    if (selectedSession) {
        return (
            <SessionDetail
                session={selectedSession}
                onBack={() => setSelectedSession(null)}
            />
        );
    }

    const filtered = sessions.filter((s) => {
        if (filter === "passed") return s.score >= 70;
        if (filter === "failed") return s.score < 40;
        if (filter === "average") return s.score >= 40 && s.score < 70;
        return true;
    });

    const passCount = sessions.filter((s) => s.score >= 70).length;
    const passRate = sessions.length
        ? Math.round((passCount / sessions.length) * 100)
        : 0;

    return (
        <div>
            {/* Page header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Quiz History
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        A record of every quiz you've completed.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full sm:w-auto border border-[#7C3AED] text-[#7C3AED] py-2 px-4 rounded-md hover:bg-purple-50 transition-colors text-sm font-medium"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {[
                    { label: "Total Quizzes", value: sessions.length },
                    { label: "Passed", value: passCount },
                    { label: "Pass Rate", value: `${passRate}%` },
                ].map(({ label, value }) => (
                    <div
                        key={label}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm text-center"
                    >
                        <p className="text-xl sm:text-2xl font-bold text-[#7C3AED]">
                            {value}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
                {(["all", "passed",  "average", "failed"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                            filter === f
                                ? "bg-[#7C3AED] text-white shadow-md shadow-purple-200"
                                : "bg-white text-gray-500 border border-gray-200 hover:border-[#7C3AED] hover:text-[#7C3AED]"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Session list */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                    <HistoryIcon size={18} className="text-[#7C3AED]" />
                    <h2 className="font-semibold text-gray-800">Sessions</h2>
                    <span className="ml-auto text-xs text-gray-400">
                        {filtered.length} results
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2
                            size={28}
                            className="animate-spin text-[#7C3AED]"
                        />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <HistoryIcon
                            size={36}
                            className="mx-auto mb-3 opacity-30"
                        />
                        <p className="font-medium">No quizzes yet</p>
                        <p className="text-sm">
                            Complete your first quiz to see it here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((session, index) => {
                            const isExpanded = expandedId === session._id;
                            return (
                                <div key={session._id}>
                                    <button
                                        className="w-full grid grid-cols-[auto_1fr_auto_auto] gap-3 px-4 py-4 items-center hover:bg-gray-50 transition-colors text-left sm:grid-cols-12 sm:gap-0 sm:px-6"
                                        onClick={() =>
                                            setExpandedId(
                                                isExpanded ? null : session._id,
                                            )
                                        }
                                    >
                                        <div className="text-sm text-gray-400 sm:col-span-1">
                                            {index + 1}.
                                        </div>
                                        <div className="min-w-0 sm:col-span-4">
                                            <p className="font-semibold text-gray-900 text-sm capitalize wrap-break-word">
                                                {session.category}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {formatDate(session.startedAt)}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
                                                <DifficultyBadge
                                                    level={session.difficulty}
                                                />
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock size={12} />
                                                    {formatTime(session.timeTaken)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block sm:col-span-2">
                                            <DifficultyBadge
                                                level={session.difficulty}
                                            />
                                        </div>
                                        <div className="hidden sm:col-span-3 sm:flex items-center gap-1.5 text-sm text-gray-500">
                                            <Clock size={13} />
                                            {formatTime(session.timeTaken)}
                                        </div>
                                        <div className="sm:col-span-1">
                                            <ScoreRing pct={session.score} />
                                        </div>
                                        <div className="flex justify-end text-gray-300 sm:col-span-1">
                                            {isExpanded ? (
                                                <ChevronUp size={16} />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expand: quick stats + view details button */}
                                    {isExpanded && (
                                        <div className="px-4 sm:px-6 pb-4 bg-gray-50 border-t border-gray-100">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
                                                {[
                                                    {
                                                        label: "Correct",
                                                        value: `${session.correctAnswers} / ${session.totalQuestions}`,
                                                    },
                                                    {
                                                        label: "Accuracy",
                                                        value: `${session.accuracy}%`,
                                                    },
                                                    {
                                                        label: "Result",
                                                        value:
                                                            session.score >= 70
                                                                ? "Passed"
                                                                : session.score >=
                                                                    40
                                                                  ? "Average"
                                                                  : "Failed",
                                                    },
                                                ].map(({ label, value }) => (
                                                    <div
                                                        key={label}
                                                        className="bg-white rounded-xl p-3 border border-gray-100"
                                                    >
                                                        <p className="text-xs text-gray-400">
                                                            {label}
                                                        </p>
                                                        <p className="font-semibold text-gray-800 mt-0.5">
                                                            {value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setSelectedSession(session)
                                                }
                                                className="mt-4 text-sm text-[#7C3AED] font-medium hover:underline"
                                            >
                                                View full breakdown →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizHistory;
