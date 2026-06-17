import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Option {
    _id: string;
    optionText: string;
    isCorrect: boolean;
}

interface Question {
    _id: string;
    questionText: string;
    options: Option[];
    category: string;
    difficulty: string;
    reference?: string;
}

const QuizPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    // sessionId and question IDs passed from Dashboard via navigate
    const { quizSessionId, questionIds, timePerQuestion } = location.state as {
        quizSessionId: string;
        questionIds: string[];
        timePerQuestion: number;
    };
    // console.log("location.state:", location.state);

    const token = localStorage.getItem("verseiq_token");

    const questionsRef = useRef<Question[]>([]);
    const selectedAnswersRef = useRef<Record<string, string>>({});
    const handleSubmitRef = useRef<() => void>(() => {});

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<
        Record<string, string>
    >({}); // { questionId: optionId }
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(
        questionIds.length * timePerQuestion,
    );
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        questionsRef.current = questions;
    }, [questions]);

    useEffect(() => {
        selectedAnswersRef.current = selectedAnswers;
    }, [selectedAnswers]);

    // fetch all questions using their IDs
    useEffect(() => {
        axios
            .post(
                "https://verseiq-server.onrender.com/api/questions/by-ids",
                { ids: questionIds },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            .then((res) => {
                setQuestions(res.data.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch questions:", err);
                setIsLoading(false);
            });
    }, []);

    // countdown timer
    useEffect(() => {
        if (isLoading) return;
        if (timeLeft <= 0) {
            handleSubmitRef.current(); // ✅ always calls the latest version
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isLoading]);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const isLastQuestion = currentIndex === totalQuestions - 1;
    const hasAnsweredCurrent = currentQuestion
        ? !!selectedAnswers[currentQuestion._id]
        : false;

    const [result, setResult] = useState<null | {
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        timeTaken: number;
    }>(null);
    const isTimeUp = timeLeft <= 0;
    const isQuizOver = !!result || isTimeUp;

    // format time as mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleSelectOption = (optionId: string) => {
        if (!currentQuestion) return;
        setSelectedAnswers((prev) => ({
            ...prev,
            [currentQuestion._id]: optionId, // save selected option for this question
        }));
    };

    const handleSubmit = () => {
        const currentQuestions = questionsRef.current;
        const currentAnswers = selectedAnswersRef.current;

        if (currentQuestions.length === 0) return;
        setIsSubmitting(true);

        const answers = currentQuestions.map((q) => {
            const selectedOptionId = currentAnswers[q._id];
            const selectedOption = q.options.find(
                (o) => o._id === selectedOptionId,
            );
            const isCorrect = selectedOption?.isCorrect ?? false;
            return {
                question: q._id,
                selectedOption: selectedOptionId || null,
                isCorrect,
            };
        });

        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        const totalQ = currentQuestions.length;
        const score = Math.round((correctAnswers / totalQ) * 100);
        const accuracy = score;
        const timeTaken = questionIds.length * timePerQuestion - timeLeft;

        axios
            .put(
                `https://verseiq-server.onrender.com/api/quiz-sessions/update/${quizSessionId}`,
                {
                    score,
                    correctAnswers,
                    status: "completed",
                    streak: correctAnswers,
                    accuracy,
                    timeTaken,
                    answers,
                },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            .then((res) => {
                // console.log("Submit response:", res.data);
                setIsSubmitting(false);
                updateUser(res.data.user);
                setResult({
                    score: res.data.data.score,
                    correctAnswers: res.data.data.correctAnswers,
                    totalQuestions: res.data.data.totalQuestions,
                    timeTaken: res.data.data.timeTaken,
                });
            })
            .catch((err) => {
                console.error("Failed to submit quiz:", err);
                setIsSubmitting(false);
            });
    };
    handleSubmitRef.current = handleSubmit;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-[#7C3AED]" size={40} />
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="text-center mt-20 text-gray-500">
                No questions found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-6 sm:py-10 px-4">
            {/* Header — progress and timer */}
            <div className="w-full max-w-2xl flex items-center justify-between gap-4 mb-5 sm:mb-6">
                <p className="text-sm text-gray-500 font-medium">
                    Question{" "}
                    <span className="text-[#7C3AED] font-bold">
                        {currentIndex + 1}
                    </span>{" "}
                    of{" "}
                    <span className="text-[#7C3AED] font-bold">
                        {totalQuestions}
                    </span>
                </p>
                {/* timer turns red when under 30 seconds */}
                <p
                    className={`shrink-0 font-bold text-base sm:text-lg ${timeLeft <= 30 ? "text-red-500" : "text-[#7C3AED]"}`}
                >
                    ⏱ {formatTime(timeLeft)}
                </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-2xl bg-gray-200 rounded-full h-2 mb-6 sm:mb-8">
                <div
                    className="bg-[#7C3AED] h-2 rounded-full transition-all duration-300"
                    style={{
                        width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                    }}
                />
            </div>

            {/* Question card */}
            <div className="bg-white shadow-md rounded-xl p-5 sm:p-8 w-full max-w-2xl mb-6">
                <p className="text-xs text-gray-400 uppercase mb-2 font-medium">
                    {currentQuestion.difficulty} · {currentQuestion.category}
                </p>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-6">
                    {currentQuestion.questionText}
                </h2>

                {/* Options */}
                <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option) => {
                        const isSelected =
                            selectedAnswers[currentQuestion._id] === option._id;
                        return (
                            <button
                                key={option._id}
                                onClick={() => handleSelectOption(option._id)}
                                disabled={isQuizOver}
                                className={`text-left py-3 px-4 rounded-lg border-2 text-sm sm:text-base font-medium transition-all duration-200 ${
                                    isSelected
                                        ? "border-[#7C3AED] bg-purple-50 text-[#7C3AED]"
                                        : "border-gray-200 text-gray-700 hover:border-[#7C3AED] hover:bg-purple-50"
                                } disabled:opacity-50 disabled:cursor-not-allowed`} 
                            >
                                {option.optionText}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Prev / Next / Submit buttons */}
            <div className="flex w-full max-w-2xl justify-between gap-3">
                <button
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    disabled={currentIndex === 0 || isQuizOver}
                    className="flex items-center justify-center gap-1 py-2 px-4 sm:px-5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={18} /> Prev
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !hasAnsweredCurrent || isQuizOver}
                        className="flex items-center justify-center gap-1 py-2 px-4 sm:px-5 rounded-md bg-[#7C3AED] text-white font-semibold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Quiz"
                        )}
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentIndex((prev) => prev + 1)}
                        disabled={!hasAnsweredCurrent || isQuizOver} 
                        className="flex items-center justify-center gap-1 py-2 px-4 sm:px-5 rounded-md bg-[#7C3AED] text-white font-semibold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                )}
            </div>
            {result && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-xl shadow-xl p-5 sm:p-8 w-full max-w-md text-center max-h-[90vh] overflow-y-auto">
                        {!showDetails ? (
                            <>
                                <h2 className="text-xl sm:text-2xl font-bold text-[#7C3AED] mb-4">
                                    Quiz Complete! 🎉
                                </h2>
                                <p className="text-3xl sm:text-4xl font-bold text-[#7C3AED] mb-2">
                                    {result.score}%
                                </p>
                                <p className="text-gray-600 mb-1">
                                    {result.correctAnswers} /{" "}
                                    {result.totalQuestions} correct
                                </p>
                                <p className="text-gray-400 text-sm mb-6">
                                    Time taken: {result.timeTaken}s
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setShowDetails(true)}
                                        className="bg-[#7C3AED] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#6D28D9] transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="border border-[#7C3AED] text-[#7C3AED] py-2 px-6 rounded-md font-semibold hover:bg-purple-50 transition-colors"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-[#7C3AED] mb-4">
                                    Result Details
                                </h2>
                                <div className="flex flex-col gap-4 text-left">
                                    {questions.map((q, index) => {
                                        const selectedOptionId =
                                            selectedAnswers[q._id];
                                        const isCorrect =
                                            q.options.find(
                                                (o) =>
                                                    o._id === selectedOptionId,
                                            )?.isCorrect ?? false;
                                        q.options.find((o) => o.isCorrect);

                                        return (
                                            <div
                                                key={q._id}
                                                className={`p-3 sm:p-4 rounded-lg border-2 ${
                                                    isCorrect
                                                        ? "border-green-400 bg-green-50"
                                                        : "border-red-400 bg-red-50"
                                                }`}
                                            >
                                                <p className="text-sm font-semibold text-gray-800 mb-2">
                                                    {index + 1}.{" "}
                                                    {q.questionText}
                                                </p>
                                                {/* show all options */}
                                                {q.options.map((o) => {
                                                    const isSelected =
                                                        o._id ===
                                                        selectedOptionId;
                                                    const isCorrectOption =
                                                        o.isCorrect;
                                                    return (
                                                        <p
                                                            key={o._id}
                                                            className={`text-sm py-1 px-2 rounded mb-1 ${
                                                                isCorrectOption
                                                                    ? "bg-green-200 text-green-800 font-medium"
                                                                    : isSelected &&
                                                                        !isCorrectOption
                                                                      ? "bg-red-200 text-red-800 line-through"
                                                                      : "text-gray-600"
                                                            }`}
                                                        >
                                                            {o.optionText}
                                                            {isCorrectOption &&
                                                                " ✓"}
                                                            {isSelected &&
                                                                !isCorrectOption &&
                                                                " ✗"}
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
                                <div className="flex flex-col gap-3 mt-6">
                                    <button
                                        onClick={() => setShowDetails(false)}
                                        className="border border-[#7C3AED] text-[#7C3AED] py-2 px-6 rounded-md font-semibold hover:bg-purple-50 transition-colors"
                                    >
                                        Back to Summary
                                    </button>
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="bg-[#7C3AED] text-white py-2 px-6 rounded-md font-semibold hover:bg-[#6D28D9] transition-colors"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
