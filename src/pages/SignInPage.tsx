import { useState } from "react";
import AuthLeftSection from "../components/AuthLeftSection";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    const signIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const credentials = { identifier, password };
        setIsLoading(true);
        setError("");

        axios
            .post(
                // "http://localhost:4576/api/users/login",
                "https://verseiq-server.onrender.com/api/users/login",
                credentials,
            )
            .then((response) => {
                navigate("/dashboard");
                login(response.data);
                // console.log("Login successful:", response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Login failed:", error);
                setError(
                    error.response?.data?.message ||
                        "An error occurred during login",
                );
                setIsLoading(false);
            });
    };

    return (
        <div className="flex min-h-screen items-stretch bg-[#F9FAFB]">
            <AuthLeftSection
                heading={"Continue Your Journey Through Scripture"}
                description={
                    "Pick up where you left off, revisit past quizzes, and continue growing in biblical knowledge through God's Word."
                }
                scripture={
                    '"The entrance of thy words giveth light; it giveth understanding unto the simple."'
                }
                verse={"- Psalm 119:130"}
            />
            <div className="md:w-1/2 w-full min-h-screen md:h-screen overflow-y-auto lg:py-20 py-8 sm:py-10 px-4 sm:px-8 lg:px-10 flex items-center">
                <form
                    action=""
                    onSubmit={signIn}
                    className="shadow-md w-full max-w-xl mx-auto md:px-10 px-5 bg-white py-8 sm:py-10 rounded-lg"
                >
                    <h1 className="md:text-2xl text-xl md:mb-10 mb-7 font-semibold text-[#7C3AED] md:px-10">
                        Get Started With VerseIQ
                    </h1>
                    <div className="flex flex-col w-full mb-4 ">
                        <label
                            htmlFor="email"
                            className="mb-1 text-sm sm:text-md font-medium"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            placeholder="john.doe@example.com"
                            name="email"
                            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    <label
                        htmlFor="password"
                        className="mb-4 text-sm sm:text-md font-medium"
                    >
                        Password
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-md py-2 px-4 focus-within:outline-none focus-within:ring focus-within:ring-[#7C3AED]">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            name="password"
                            className="w-full min-w-0 border-none focus:border-0 focus:ring-0 focus:outline-0"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <i
                            className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} text-gray-400 cursor-pointer`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>

                    {isLoading ? (
                        <button
                            type="button"
                            className="bg-[#7C3AED] flex items-center justify-center text-white py-2 my-10 font-semibold w-full cursor-not-allowed rounded-md opacity-50"
                            disabled
                        >
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Signing In...
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-[#7C3AED] text-white py-2 mt-5 font-semibold w-full cursor-pointer rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring focus:ring-[#7C3AED]"
                        >
                            Sign In
                        </button>
                    )}
                    {error && (
                        <p className="text-red-500 text-md text-center my-2">
                            {error}
                        </p>
                    )}
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-[#7C3AED] hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
