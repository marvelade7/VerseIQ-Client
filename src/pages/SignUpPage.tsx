import { useState } from "react";
import AuthLeftSection from "../components/AuthLeftSection";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex items-center bg-[#F9FAFB]">
            <AuthLeftSection
                heading={'Deepen Your Understanding of Scripture'}
                description={"Challenge yourself with carefully crafted Bible quizzes, track your growth, and strengthen your knowledge of God's Word one verse at a time."}
                scripture={'"Thy word is a lamp unto my feet, and a light unto my path."'}
                verse={'- Psalm 119:105'}
            />
            <div className=" md:w-1/2 bg-white w-full h-screen lg:py-10 py-10 px-10">
                <form action="" className="shadow-md md:w-xl w-full mx-auto md:px-10 px-5 bg-white py-10 rounded-lg">
                    <h1 className="md:text-2xl text-xl md:mb-10 mb-7 font-semibold text-[#7C3AED] ">Get Started With VerseIQ</h1>
                    <div className="flex md:flex-row md:gap-5 gap-3 flex-col mb-3  w-full">
                        <div className="flex flex-col mb-3  md:w-1/2 w-full">
                            <label htmlFor="firstName" className="mb-1 text-sm sm:text-md font-medium">First Name</label>
                            <input type="text" id="firstName" placeholder="John" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                        </div>

                        <div className="flex flex-col  md:w-1/2 w-full">
                            <label htmlFor="lastName" className="mb-1 text-sm sm:text-md font-medium">Last Name</label>
                            <input type="text" id="lastName" placeholder="Doe" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                        </div>
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label htmlFor="email" className="mb-1 text-sm sm:text-md font-medium">Email</label>
                        <input type="email" id="email" placeholder="john.doe@example.com" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label htmlFor="username" className="mb-1 text-sm sm:text-md font-medium">Username</label>
                        <input type="text" id="username" placeholder="johndoe7" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                    </div>

                    <div className="flex md:flex-row md:gap-5 gap-3 flex-col mb-3 w-full">
                        <div className="flex flex-col mb-3 md:w-1/2 w-full">
                            <label htmlFor="password" className="mb-1 text-sm sm:text-md font-medium">Password</label>
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
                        </div>

                        <div className="flex flex-col mb-3 md:w-1/2 w-full">
                            <label htmlFor="confirmPassword" className="mb-1 text-sm sm:text-md font-medium">Confirm Password</label>
                            <input type="password" id="confirmPassword" placeholder="••••••••" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                        </div>

                    </div>
                    <div className="flex items-center mb-6">
                        <input type="checkbox" id="terms" className="mr-2" />
                        <label htmlFor="terms" className="text-center text-[.8em] sm:text-sm">I agree to the <a href="#" className="text-[#7C3AED] hover:underline">Terms of Service</a> and <a href="#" className="text-[#7C3AED] hover:underline">Privacy Policy</a></label>
                    </div>

                    <button type="submit" className="bg-[#7C3AED] text-white py-2 mb-10 font-semibold w-full cursor-pointer rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring focus:ring-[#7C3AED]">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;