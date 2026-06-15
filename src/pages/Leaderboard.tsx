import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Trophy, Medal, Crown, Loader2, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
    rank: number;
    firstName: string;
    lastName: string;
    bestScore: number;
    totalQuizTaken: number;
    longestStreak: number;
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
            .get("https://verseiq-server.onrender.com/api/leaderboard", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                setEntries(res.data.data || []);
                setIsLoading(false);
            })
            .catch(() => {
                // Fallback mock data so UI is visible even without API
                setEntries(MOCK_ENTRIES);
                setIsLoading(false);
                setError("Could not load live data — showing sample leaderboard.");
            });
    }, []);

    const currentUserRank =
        entries.findIndex(
            (e) => e.firstName === user?.firstName && e.lastName === user?.lastName,
        ) + 1;

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
                <p className="text-gray-500 mt-1">See how you rank against other players globally.</p>
            </div>

            {/* Your rank banner */}
            {currentUserRank > 0 && (
                <div className="bg-gradient-to-r from-[#7C3AED] to-[#9F67FA] rounded-2xl p-5 mb-6 flex items-center gap-4 text-white shadow-lg shadow-purple-200">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <p className="text-white/70 text-sm">Your current rank</p>
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
                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                    <Trophy size={18} className="text-[#7C3AED]" />
                    <h2 className="font-semibold text-gray-800">Top Players</h2>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={28} className="animate-spin text-[#7C3AED]" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {/* Column headers */}
                        <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-4">Player</div>
                            <div className="col-span-2 text-center">Best Score</div>
                            <div className="col-span-3 text-center">Quizzes</div>
                            <div className="col-span-2 text-center">Streak</div>
                        </div>

                        {entries.map((entry, i) => {
                            const isMe =
                                entry.firstName === user?.firstName &&
                                entry.lastName === user?.lastName;
                            return (
                                <div
                                    key={i}
                                    className={`grid grid-cols-12 px-6 py-4 items-center transition-colors ${
                                        isMe
                                            ? "bg-purple-50 border-l-4 border-l-[#7C3AED]"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <div className="col-span-1">
                                        <RankBadge rank={entry.rank} />
                                    </div>
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {entry.firstName[0]}
                                            {entry.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                {entry.firstName} {entry.lastName}
                                                {isMe && (
                                                    <span className="ml-2 text-xs bg-[#7C3AED] text-white px-1.5 py-0.5 rounded-full">
                                                        You
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center font-bold text-[#7C3AED]">
                                        {entry.bestScore}
                                    </div>
                                    <div className="col-span-3 text-center text-gray-600 text-sm">
                                        {entry.totalQuizTaken}
                                    </div>
                                    <div className="col-span-2 text-center text-sm text-gray-600">
                                        🔥 {entry.longestStreak}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const MOCK_ENTRIES: LeaderboardEntry[] = [
    { rank: 1, firstName: "David", lastName: "Okonkwo", bestScore: 98, totalQuizTaken: 87, longestStreak: 21 },
    { rank: 2, firstName: "Grace", lastName: "Adeyemi", bestScore: 95, totalQuizTaken: 74, longestStreak: 15 },
    { rank: 3, firstName: "Samuel", lastName: "Obi", bestScore: 92, totalQuizTaken: 63, longestStreak: 12 },
    { rank: 4, firstName: "Faith", lastName: "Eze", bestScore: 89, totalQuizTaken: 58, longestStreak: 9 },
    { rank: 5, firstName: "Emmanuel", lastName: "Bello", bestScore: 86, totalQuizTaken: 45, longestStreak: 7 },
    { rank: 6, firstName: "Ruth", lastName: "Nwosu", bestScore: 83, totalQuizTaken: 40, longestStreak: 6 },
    { rank: 7, firstName: "Joshua", lastName: "Afolabi", bestScore: 80, totalQuizTaken: 35, longestStreak: 5 },
];

export default Leaderboard;