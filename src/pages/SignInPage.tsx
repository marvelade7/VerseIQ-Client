import { useState } from "react";
import AuthLeftSection from "../components/AuthLeftSection";

const SignInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex items-center bg-[#F9FAFB]">
            <AuthLeftSection
                heading={'Continue Your Journey Through Scripture'}
                description={"Pick up where you left off, revisit past quizzes, and continue growing in biblical knowledge through God's Word."}
                scripture={'"The entrance of thy words giveth light; it giveth understanding unto the simple."'}
                verse={'- Psalm 119:130'}
            />
            <div className=" md:w-1/2 w-full h-screen lg:py-20 py-10 px-10">
                <form action="" className="shadow-md w-md mx-20 px-10 bg-white py-10 rounded-lg">
                    <h1 className="md:text-2xl text-xl md:mb-10 mb-7 font-semibold text-[#7C3AED] md:px-10 px-5">Get Started With VerseIQ</h1>
                    <div className="flex flex-col w-full mb-4 ">
                        <label htmlFor="email" className="mb-1 text-sm sm:text-md font-medium">Email</label>
                        <input type="email" id="email" placeholder="john.doe@example.com" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                    </div>

                    <label htmlFor="password" className="mb-4 text-sm sm:text-md font-medium">Password</label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-md py-2 px-4 focus-within:outline-none focus-within:ring focus-within:ring-[#7C3AED]">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            className="border-none focus:border-0 focus:ring-0 focus:outline-0"
                        />
                        <i
                            className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} text-gray-400 cursor-pointer`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>

                    <button type="submit" className="bg-[#7C3AED] text-white py-2 my-10 font-semibold w-full cursor-pointer rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring focus:ring-[#7C3AED]">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;