import { useState } from "react";
import SignUpLeftSection from "../components/SignUpLeftSection";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex">
            <SignUpLeftSection />
            <div className="w-1/2 h-screen py-27 px-10">
                <h1 className="text-3xl mb-10 font-semibold text-[#7C3AED] px-10">Get Started With VerseIQ</h1>
                <form action="" className="">
                    <div className="flex gap-5 mb-3 px-10 w-full">
                        <div className="flex flex-col mb-3 w-1/2">
                            <label htmlFor="firstName" className="mb-1 font-medium">First Name</label>
                            <input type="text" id="firstName" placeholder="John" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                        </div>

                        <div className="flex flex-col w-1/2">
                            <label htmlFor="lastName" className="mb-1 font-medium">Last Name</label>
                            <input type="text" id="lastName" placeholder="Doe" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                        </div>
                    </div>

                    <div className="flex flex-col w-full mb-4 px-10">
                        <label htmlFor="email" className="mb-1 font-medium">Email</label>
                        <input type="email" id="email" placeholder="john.doe@example.com" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                    </div>

                    <div className="flex flex-col w-full mb-4 px-10">
                        <label htmlFor="username" className="mb-1 font-medium">Username</label>
                        <input type="text" id="username" placeholder="johndoe7" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                    </div>

                    <div className="flex gap-5 mb-3 px-10 w-full">
                        <div className="flex flex-col mb-3 w-1/2">
                            <label htmlFor="password" className="mb-1 font-medium">Password</label>
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

                        <div className="flex flex-col w-1/2">
                            <label htmlFor="confirmPassword" className="mb-1 font-medium">Confirm Password</label>
                            <input type="password" id="confirmPassword" placeholder="••••••••" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]" />
                        </div>

                    </div>
                    <div className="flex items-center mb-6 px-10 ">
                        <input type="checkbox" id="terms" className="mr-2" />
                        <label htmlFor="terms" className="text-center">I agree to the <a href="#" className="text-[#7C3AED] hover:underline">Terms of Service</a> and <a href="#" className="text-[#7C3AED] hover:underline">Privacy Policy</a></label>
                    </div>

                    <button type="submit" className="bg-[#7C3AED] text-white py-2 mx-10 font-semibold w-100 cursor-pointer rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring focus:ring-[#7C3AED]">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;