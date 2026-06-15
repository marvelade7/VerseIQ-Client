import { useState, useEffect } from "react";
import axios from "axios";
import { History as HistoryIcon, Loader2, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface QuizSession {
    _id: string;
    difficulty: string;
    category: string;
    score: number;
    totalQuestions: number;
    timeTaken?: number;
    createdAt: string;
    passed: boolean;
}

const DifficultyBadge = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
        easy: "bg-green-100 text-green-700",
        medium: "bg-yellow-100 text-yellow-700",
        hard: "bg-red-100 text-red-700",
        mixed: "bg-purple-100 text-purple-700",
    };
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${colors[level] ?? "bg-gray-100 text-gray-600"}`}>
            {level}
        </span>
    );
};

const ScoreRing = ({ score, total }: { score: number; total: number }) => {
    const pct = Math.round((score / total) * 100);
    const color = pct >= 70 ? "#10B981" : pct >= 40 ? "#F59E0B" : "#EF4444";
    return (
        <div className="flex flex-col items-center">
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ border: `3px solid ${color}`, color }}
            >
                {pct}%
            </div>
            <p className="text-xs text-gray-400 mt-1">{score}/{total}</p>
        </div>
    );
};

const History = () => {
    const [sessions, setSessions] = useState<QuizSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");
    const token = localStorage.getItem("verseiq_token");

    useEffect(() => {
        axios
            .get("https://verseiq-server.onrender.com/api/quiz-sessions/history", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setSessions(res.data.data || []);
                setIsLoading(false);
            })
            .catch(() => {
                setSessions(MOCK_SESSIONS);
                setIsLoading(false);
                setError("Could not load live data — showing sample history.");
            });
    }, []);

    const filtered = sessions.filter((s) => {
        if (filter === "passed") return s.passed;
        if (filter === "failed") return !s.passed;
        return true;
    });

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    };

    const formatTime = (secs?: number) => {
        if (!secs) return "—";
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s}s`;
    };

    const passRate = sessions.length
        ? Math.round((sessions.filter((s) => s.passed).length / sessions.length) * 100)
        : 0;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
                <p className="text-gray-500 mt-1">A record of every quiz you've completed.</p>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: "Total Quizzes", value: sessions.length },
                    { label: "Passed", value: sessions.filter((s) => s.passed).length },
                    { label: "Pass Rate", value: `${passRate}%` },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                        <p className="text-2xl font-bold text-[#7C3AED]">{value}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {error && (
                <p className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                    {error}
                </p>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
                {(["all", "passed", "failed"] as const).map((f) => (
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

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                    <HistoryIcon size={18} className="text-[#7C3AED]" />
                    <h2 className="font-semibold text-gray-800">Sessions</h2>
                    <span className="ml-auto text-xs text-gray-400">{filtered.length} results</span>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={28} className="animate-spin text-[#7C3AED]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <HistoryIcon size={36} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No quizzes yet</p>
                        <p className="text-sm">Complete your first quiz to see it here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((session) => {
                            const isExpanded = expandedId === session._id;
                            return (
                                <div key={session._id}>
                                    <button
                                        className="w-full grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors text-left"
                                        onClick={() =>
                                            setExpandedId(isExpanded ? null : session._id)
                                        }
                                    >
                                        <div className="col-span-1">
                                            {session.passed ? (
                                                <CheckCircle2 size={20} className="text-green-500" />
                                            ) : (
                                                <XCircle size={20} className="text-red-400" />
                                            )}
                                        </div>
                                        <div className="col-span-4">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {session.category}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {formatDate(session.createdAt)}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <DifficultyBadge level={session.difficulty} />
                                        </div>
                                        <div className="col-span-3 flex items-center gap-1.5 text-sm text-gray-500">
                                            <Clock size={13} />
                                            {formatTime(session.timeTaken)}
                                        </div>
                                        <div className="col-span-1">
                                            <ScoreRing score={session.score} total={session.totalQuestions} />
                                        </div>
                                        <div className="col-span-1 flex justify-end text-gray-300">
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="px-6 pb-4 bg-gray-50 border-t border-gray-100">
                                            <div className="grid grid-cols-3 gap-4 pt-4">
                                                {[
                                                    { label: "Score", value: `${session.score} / ${session.totalQuestions}` },
                                                    { label: "Time Taken", value: formatTime(session.timeTaken) },
                                                    { label: "Result", value: session.passed ? "Passed ✅" : "Failed ❌" },
                                                ].map(({ label, value }) => (
                                                    <div key={label} className="bg-white rounded-xl p-3 border border-gray-100">
                                                        <p className="text-xs text-gray-400">{label}</p>
                                                        <p className="font-semibold text-gray-800 mt-0.5">{value}</p>
                                                    </div>
                                                ))}
                                            </div>
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

const MOCK_SESSIONS: QuizSession[] = [
    { _id: "1", difficulty: "easy", category: "Old Testament", score: 9, totalQuestions: 10, timeTaken: 48, createdAt: "2024-06-10T10:00:00Z", passed: true },
    { _id: "2", difficulty: "hard", category: "New Testament", score: 4, totalQuestions: 15, timeTaken: 210, createdAt: "2024-06-08T14:00:00Z", passed: false },
    { _id: "3", difficulty: "medium", category: "Mixed", score: 12, totalQuestions: 20, timeTaken: 195, createdAt: "2024-06-05T09:00:00Z", passed: true },
    { _id: "4", difficulty: "mixed", category: "Mixed", score: 7, totalQuestions: 10, timeTaken: 90, createdAt: "2024-06-01T16:00:00Z", passed: true },
];

export default History;