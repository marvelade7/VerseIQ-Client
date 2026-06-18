import { useState } from "react";
import AuthLeftSection from "../components/AuthLeftSection";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
        onSubmit: (values, { resetForm }) => {
            const normalizedEmail = values.email.trim().toLowerCase();
            setIsLoading(true);
            axios
                .post(
                    "https://verseiq-server.onrender.com/api/users/register",
                    { ...values, email: normalizedEmail },
                )
                .then((response) => {
                    navigate("/signin");
                    console.log("Registration successful:", response.data);
                    resetForm();
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(
                        "Registration error:",
                        error.response ? error.response.data : error.message,
                    );
                    setIsLoading(false);
                });
        },
        validateOnMount: true,
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema: yup.object({
            firstName: yup.string().required("First name is required"),
            lastName: yup.string().required("Last name is required"),
            email: yup
                .string()
                .email("Invalid email format")
                .required("Email is required"),
            username: yup
                .string()
                .min(4, "Username must be at least 4 characters")
                .matches(/^[^@]+$/, "Username cannot contain @")
                .matches(/^\S*$/, "Username cannot contain spaces")
                .required("Username is required"),
            password: yup
                .string()
                .min(6, "Password must be at least 6 characters")
                .matches(/^\S*$/, "Password cannot contain spaces")
                .matches(/[a-z]/, "must contain at least one lowercase letter")
                .matches(/[A-Z]/, "must contain at least one uppercase letter")
                .matches(/[0-9]/, "must contain at least a number")
                .matches(
                    /[!@#$%_-]/,
                    "must contain at least a special character (! @ # $ % _ -)",
                )
                .required("Password is required"),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref("password")], "Passwords must match")
                .required("Confirm password is required"),
            terms: yup
                .boolean()
                .oneOf([true], "You must accept the terms and conditions")
                .required("Terms acceptance is required"),
        }),
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const password = formik.values.password;

    const passwordRules = {
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@#$%!]/.test(password),
        length: password.length >= 6,
    };
    return (
        <div className="flex min-h-screen items-stretch bg-[#F9FAFB]">
            <AuthLeftSection
                heading={"Deepen Your Understanding of Scripture"}
                description={
                    "Challenge yourself with carefully crafted Bible quizzes, track your growth, and strengthen your knowledge of God's Word one verse at a time."
                }
                scripture={
                    '"Thy word is a lamp unto my feet, and a light unto my path."'
                }
                verse={"- Psalm 119:105"}
            />
            <div className="md:w-1/2 bg-white w-full min-h-screen md:h-screen overflow-y-auto lg:py-10 py-8 sm:py-10 px-4 sm:px-8 lg:px-10">
                <form
                    action=""
                    onSubmit={formik.handleSubmit}
                    className="shadow-md w-full max-w-xl mx-auto md:px-10 px-5 bg-white py-8 sm:py-10 rounded-lg"
                >
                    <h1 className="md:text-2xl text-xl md:mb-10 mb-7 font-semibold text-[#7C3AED] ">
                        Get Started With VerseIQ
                    </h1>
                    <div className="flex md:flex-row md:gap-5 gap-2 flex-col mb-3  w-full">
                        <div className="flex flex-col md:w-1/2 w-full">
                            <label
                                htmlFor="firstName"
                                className="mb-3 text-sm sm:text-md font-medium"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                placeholder="John"
                                name="firstName"
                                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.firstName}
                            />
                            {formik.touched.firstName &&
                                formik.errors.firstName && (
                                    <small className="text-red-500 mt-1">
                                        {formik.errors.firstName}
                                    </small>
                                )}
                        </div>

                        <div className="flex flex-col md:w-1/2 w-full">
                            <label
                                htmlFor="lastName"
                                className="mb-1 text-sm sm:text-md font-medium"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                placeholder="Doe"
                                name="lastName"
                                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.lastName}
                            />
                            {formik.touched.lastName &&
                                formik.errors.lastName && (
                                    <small className="text-red-500 mt-1">
                                        {formik.errors.lastName}
                                    </small>
                                )}
                        </div>
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label
                            htmlFor="email"
                            className="mb-1 text-sm sm:text-md font-medium"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="john.doe@example.com"
                            name="email"
                            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <small className="text-red-500 mt-1">
                                {formik.errors.email}
                            </small>
                        )}
                    </div>

                    <div className="flex flex-col w-full mb-4">
                        <label
                            htmlFor="username"
                            className="mb-1 text-sm sm:text-md font-medium"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="johndoe7"
                            name="username"
                            className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <small className="text-red-500 mt-1">
                                {formik.errors.username}
                            </small>
                        )}
                    </div>

                    <div className="flex md:flex-row md:gap-5 gap-3 flex-col mb-3 w-full">
                        <div className="flex flex-col mb-3 md:w-1/2 w-full">
                            <label
                                htmlFor="password"
                                className="mb-1 text-sm sm:text-md font-medium"
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
                                    onChange={formik.handleChange}
                                    onBlur={(e) => {
                                        formik.handleBlur(e);
                                        setShowPasswordRules(false);
                                    }}
                                    onFocus={() => setShowPasswordRules(true)}
                                    value={formik.values.password}
                                />
                                <i
                                    className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"} text-gray-400 cursor-pointer`}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                ></i>
                            </div>
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <small className="text-red-500 mt-1">
                                        {formik.errors.password}
                                    </small>
                                )}

                            {showPasswordRules && (
                                <div className="mt-2 text-sm">
                                    <p
                                        className={
                                            passwordRules.lowercase
                                                ? "text-green-500"
                                                : "text-gray-500"
                                        }
                                    >
                                        {passwordRules.lowercase ? (
                                            <i className="bi bi-check-circle text-green-500 tick"></i>
                                        ) : (
                                            <i className="bi bi-x-circle"></i>
                                        )}{" "}
                                        At least one lowercase letter
                                    </p>

                                    <p
                                        className={
                                            passwordRules.uppercase
                                                ? "text-green-500"
                                                : "text-gray-500"
                                        }
                                    >
                                        {passwordRules.uppercase ? (
                                            <i className="bi bi-check-circle text-green-500 tick"></i>
                                        ) : (
                                            <i className="bi bi-x-circle"></i>
                                        )}{" "}
                                        At least one uppercase letter
                                    </p>

                                    <p
                                        className={
                                            passwordRules.number
                                                ? "text-green-500"
                                                : "text-gray-500"
                                        }
                                    >
                                        {passwordRules.number ? (
                                            <i className="bi bi-check-circle text-green-500 tick"></i>
                                        ) : (
                                            <i className="bi bi-x-circle"></i>
                                        )}{" "}
                                        At least one number
                                    </p>

                                    <p
                                        className={
                                            passwordRules.special
                                                ? "text-green-500"
                                                : "text-gray-500"
                                        }
                                    >
                                        {passwordRules.special ? (
                                            <i className="bi bi-check-circle text-green-500 tick"></i>
                                        ) : (
                                            <i className="bi bi-x-circle"></i>
                                        )}{" "}
                                        At least one special character (@ # $ %
                                        !)
                                    </p>

                                    <p
                                        className={
                                            passwordRules.length
                                                ? "text-green-500"
                                                : "text-gray-500"
                                        }
                                    >
                                        {passwordRules.length ? (
                                            <i className="bi bi-check-circle text-green-500 tick"></i>
                                        ) : (
                                            <i className="bi bi-x-circle"></i>
                                        )}{" "}
                                        Minimum 6 characters
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col mb-3 md:w-1/2 w-full">
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1 text-sm sm:text-md font-medium"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"
                                name="confirmPassword"
                                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-[#7C3AED]"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword &&
                                formik.errors.confirmPassword && (
                                    <small className="text-red-500 mt-1">
                                        {formik.errors.confirmPassword}
                                    </small>
                                )}
                        </div>
                    </div>
                    <div className="flex items-start gap-2 mb-6 flex-wrap">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 shrink-0"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            // value={formik.values.terms}
                        />
                        <label
                            htmlFor="terms"
                            className="flex-1 text-left text-[.8em] sm:text-sm"
                        >
                            I agree to the{" "}
                            <a
                                href="#"
                                className="text-[#7C3AED] hover:underline"
                            >
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a
                                href="#"
                                className="text-[#7C3AED] hover:underline"
                            >
                                Privacy Policy
                            </a>
                        </label>
                        {formik.touched.terms && formik.errors.terms && (
                            <small className="w-full text-red-500 mb-3">
                                {formik.errors.terms}
                            </small>
                        )}
                    </div>
                    {isLoading ? (
                        <button
                            type="button"
                            className="bg-[#7C3AED] flex items-center justify-center text-white py-2 mb-10 font-semibold w-full cursor-not-allowed rounded-md opacity-50"
                            disabled
                        >
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating Account...
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-[#7C3AED] text-white py-2 mb-10 font-semibold w-full cursor-pointer rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring focus:ring-[#7C3AED]"
                        >
                            Create Account
                        </button>
                    )}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-[#7C3AED] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;
