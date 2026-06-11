// src/pages/QuizPage.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

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

    // sessionId and question IDs passed from Dashboard via navigate
    const { sessionId, questionIds } = location.state as {
        sessionId: string;
        questionIds: string[];
    };

    const token = localStorage.getItem("verseiq_token");

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({}); // { questionId: optionId }
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(questionIds.length * 20); // 20s per question

    // fetch all questions using their IDs
    useEffect(() => {
        axios
            .post(
                "http://localhost:4576/api/questions/by-ids",
                // "https://verseiq-server.onrender.com/api/questions/by-ids",
                { ids: questionIds },
                { headers: { Authorization: `Bearer ${token}` } }
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
            handleSubmit(); // auto submit when time runs out
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer); // cleanup on unmount
    }, [timeLeft, isLoading]);

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const isLastQuestion = currentIndex === totalQuestions - 1;
    const hasAnsweredCurrent = currentQuestion
        ? !!selectedAnswers[currentQuestion._id]
        : false;

    // format time as mm:ss
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
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
        setIsSubmitting(true);

        // build answers array from selectedAnswers
        const answers = questions.map((q) => {
            const selectedOptionId = selectedAnswers[q._id];
            const selectedOption = q.options.find((o) => o._id === selectedOptionId);
            const isCorrect = selectedOption?.isCorrect ?? false;
            return {
                question: q._id,
                selectedOption: selectedOptionId || null,
                isCorrect,
            };
        });

        const correctAnswers = answers.filter((a) => a.isCorrect).length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const accuracy = score;
        const timeTaken = questionIds.length * 20 - timeLeft; // seconds used

        axios
            .put(
                `http://localhost:4576/api/quiz-sessions/update/${sessionId}`,
                // `https://verseiq-server.onrender.com/api/quiz-sessions/${sessionId}`,
                {
                    score,
                    correctAnswers,
                    status: "completed",
                    streak: correctAnswers,
                    accuracy,
                    timeTaken,
                    answers,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                console.log("Quiz submitted:", res.data);
                navigate("/results", { state: { sessionId } }); // go to results page
            })
            .catch((err) => {
                console.error("Failed to submit quiz:", err);
                setIsSubmitting(false);
            });
    };

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
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-10 px-4">

            {/* Header — progress and timer */}
            <div className="w-full max-w-2xl flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500 font-medium">
                    Question{" "}
                    <span className="text-[#7C3AED] font-bold">{currentIndex + 1}</span>
                    {" "}of{" "}
                    <span className="text-[#7C3AED] font-bold">{totalQuestions}</span>
                </p>
                {/* timer turns red when under 30 seconds */}
                <p className={`font-bold text-lg ${timeLeft <= 30 ? "text-red-500" : "text-[#7C3AED]"}`}>
                    ⏱ {formatTime(timeLeft)}
                </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-2xl bg-gray-200 rounded-full h-2 mb-8">
                <div
                    className="bg-[#7C3AED] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                />
            </div>

            {/* Question card */}
            <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-2xl mb-6">
                <p className="text-xs text-gray-400 uppercase mb-2 font-medium">
                    {currentQuestion.difficulty} · {currentQuestion.category}
                </p>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
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
                                className={`text-left py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                                    isSelected
                                        ? "border-[#7C3AED] bg-purple-50 text-[#7C3AED]"
                                        : "border-gray-200 text-gray-700 hover:border-[#7C3AED] hover:bg-purple-50"
                                }`}
                            >
                                {option.optionText}
                            </button>
                        );
                    })}
                </div>

                {/* Bible reference if available */}
                {currentQuestion.reference && (
                    <p className="text-xs text-gray-400 mt-4 italic">
                        📖 {currentQuestion.reference}
                    </p>
                )}
            </div>

            {/* Prev / Next / Submit buttons */}
            <div className="flex justify-between w-full max-w-2xl">
                <button
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1 py-2 px-5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={18} /> Prev
                </button>

                {isLastQuestion ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !hasAnsweredCurrent}
                        className="flex items-center gap-1 py-2 px-5 rounded-md bg-[#7C3AED] text-white font-semibold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                        disabled={!hasAnsweredCurrent} // must answer before moving on
                        className="flex items-center gap-1 py-2 px-5 rounded-md bg-[#7C3AED] text-white font-semibold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizPage;