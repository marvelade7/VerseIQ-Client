import { X, Loader2, Clock, BookOpen, Zap } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard" | "mixed";
type Testament = "old" | "new" | "mixed";

const TIME_PER_QUESTION: Record<Difficulty, number> = {
    easy: 5,
    medium: 10,
    hard: 15,
    mixed: 10,
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
    easy: "#10B981",
    medium: "#F59E0B",
    hard: "#EF4444",
    mixed: "#7C3AED",
};

interface QuizModalProps {
    onClose: () => void;
    difficulty: Difficulty;
    setDifficulty: (d: Difficulty) => void;
    numQuestions: number;
    setNumQuestions: (n: number) => void;
    testament: Testament;
    setTestament: (t: Testament) => void;
    isStartingQuiz: boolean;
    error: string;
    onStart: () => void;
}

const QuizModal = ({
    onClose,
    difficulty,
    setDifficulty,
    numQuestions,
    setNumQuestions,
    testament,
    setTestament,
    isStartingQuiz,
    error,
    onStart,
}: QuizModalProps) => {
    const totalSeconds = TIME_PER_QUESTION[difficulty] * numQuestions;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const timeDisplay =
        remainingSeconds === 0
            ? `${totalMinutes} min`
            : `${totalMinutes} min ${remainingSeconds} sec`;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-linear-to-r from-[#7C3AED] to-[#9F67FA] px-8 py-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <Zap size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-xl">
                                Configure Quiz
                            </h2>
                            <p className="text-white/70 text-sm">
                                Set your preferences below
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 space-y-6">
                    {/* Testament */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <BookOpen size={15} className="text-[#7C3AED]" />
                            Source
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["old", "new", "mixed"] as Testament[]).map(
                                (t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTestament(t)}
                                        className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                                            testament === t
                                                ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-md shadow-purple-200"
                                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#7C3AED] hover:text-[#7C3AED]"
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

                    {/* Difficulty */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <Zap size={15} className="text-[#7C3AED]" />
                            Difficulty
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {(
                                ["easy", "medium", "hard", "mixed"] as Difficulty[]
                            ).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-2.5 rounded-xl text-xs font-semibold capitalize transition-all duration-200 border ${
                                        difficulty === level
                                            ? "text-white border-transparent shadow-md"
                                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}
                                    style={
                                        difficulty === level
                                            ? {
                                                  backgroundColor:
                                                      DIFFICULTY_COLORS[level],
                                                  boxShadow: `0 4px 12px ${DIFFICULTY_COLORS[level]}40`,
                                              }
                                            : {}
                                    }
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Questions slider */}
                    <div>
                        <label className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-3">
                            <span>Number of Questions</span>
                            <span className="text-[#7C3AED] font-bold text-base">
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
                            className="w-full accent-[#7C3AED] h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>5</span>
                            <span>50</span>
                        </div>
                    </div>

                    {/* Time estimate */}
                    <div className="bg-linear-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#7C3AED]/10 rounded-xl flex items-center justify-center shrink-0">
                            <Clock size={18} className="text-[#7C3AED]" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">
                                Estimated time
                            </p>
                            <p className="text-xl font-bold text-[#7C3AED]">
                                {timeDisplay}
                            </p>
                            <p className="text-xs text-gray-400">
                                {TIME_PER_QUESTION[difficulty]}s per question ×{" "}
                                {numQuestions} questions
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={onStart}
                        disabled={isStartingQuiz}
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isStartingQuiz ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Starting…
                            </>
                        ) : (
                            "Let's Go →"
                        )}
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizModal;