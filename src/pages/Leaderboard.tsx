import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Trophy, Medal, Crown, Loader2 } from "lucide-react";

interface LeaderboardEntry {
    rank: number;
    firstName: string;
    lastName: string;
    username: string;
    totalPoints: number;
    quizzesCompleted: number;
    highestStreak: number;
    averageAccuracy: number;
    totalCorrectAnswers: number;
    totalQuestions: number;
}

const RankBadge = ({ rank }: { rank: number }) => {
    if (rank === 1)
        return (
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-md shadow-yellow-200">
                <Crown size={14} className="text-white" />
            </div>
        );
    if (rank === 2)
        return (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shadow-md">
                <Medal size={14} className="text-white" />
            </div>
        );
    if (rank === 3)
        return (
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
                <Medal size={14} className="text-white" />
            </div>
        );
    return (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500">#{rank}</span>
        </div>
    );
};

const Leaderboard = () => {
    const { user } = useAuth();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("verseiq_token");

    useEffect(() => {
        axios
            .get(
                "https://verseiq-server.onrender.com/api/quiz-sessions/leaderboard",
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            .then((res) => {
                setEntries(res.data || []);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                setError(
                    "Could not load live data — showing sample leaderboard.",
                );
            });
    }, []);

    const currentUserRank =
        entries.findIndex((e) => e.username === user?.username) + 1;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Leaderboard
                </h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    See how you rank against other players globally.
                </p>
            </div>

            {/* Your rank banner */}
            {currentUserRank > 0 && (
                <div className="bg-linear-to-r from-[#7C3AED] to-[#9F67FA] rounded-2xl py-4 px-6 sm:p-5 mb-6 flex items-center gap-4 text-white shadow-lg shadow-purple-200">
                    <div>
                        <p className="text-white/70 text-sm">
                            Your current rank
                        </p>
                        <p className="text-2xl font-bold">#{currentUserRank}</p>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-amber-600 text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                    {error}
                </p>
            )}

            {/* Table */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="px-4 sm:px-6 py-4 border-b border-gray-50 flex items-center gap-2">
        <Trophy size={18} className="text-[#7C3AED]" />
        <h2 className="font-semibold text-gray-800">Top Players</h2>
    </div>

    {isLoading ? (
        <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#7C3AED]" />
        </div>
    ) : (
        <div className="overflow-x-auto">
            <div className="min-w-150 divide-y divide-gray-50">
                {/* Column headers */}
                <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-4">Player</div>
                    <div className="col-span-2 text-center">Points</div>
                    <div className="col-span-3 text-center">Quizzes</div>
                    <div className="col-span-2 text-center">Streak</div>
                </div>

                {entries.map((entry, i) => {
                    const isMe = entry.username === user?.username;
                    return (
                        <div
                            key={i}
                            className={`grid grid-cols-12 gap-0 px-6 py-4 items-center transition-colors ${
                                isMe
                                    ? "bg-purple-50 border-l-4 border-l-[#7C3AED]"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <div className="col-span-1">
                                <RankBadge rank={entry.rank} />
                            </div>
                            <div className="min-w-0 flex items-center gap-3 col-span-4">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {entry.firstName[0]}
                                    {entry.lastName[0]}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm truncate">
                                        {entry.username}
                                        {isMe && (
                                            <span className="ml-2 inline-flex text-xs bg-[#7C3AED] text-white px-1.5 py-0.5 rounded-full">
                                                You
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="col-span-2 text-center font-bold text-[#7C3AED]">
                                {entry.totalPoints} pts
                            </div>
                            <div className="col-span-3 text-center text-gray-600 text-sm">
                                {entry.quizzesCompleted}
                            </div>
                            <div className="col-span-2 text-center text-sm text-gray-600">
                                {entry.highestStreak}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )}
</div>
        </div>
    );
};

export default Leaderboard;
