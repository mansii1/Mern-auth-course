import React, { useState } from "react";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail, MailIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const { isLoading, error, forgotPassword} = useAuthStore();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
          await forgotPassword(email);
          setIsSubmitted(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
    };
    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ">
            <div className="p-8">
                <h2 className="text-3xl font-bold text-center mb-5 bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                    Forgot Password
                </h2>

                {!isSubmitted ? (
                    <>
                        {" "}
                        <p className="text-center text-gray-300 mb-6">
                            Enter your email address and we will send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSignUp}>
                            <Input
                                type="email"
                                icon={Mail}
                                placeholder="Email"
                                name="email"
                                required
                                value={email}
                                onChange={handleChange}
                            />

                            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

                            <button
                                type="submit"
                                className="w-full focus:outline-none text-white bg-gradient-to-r from-green-500 to-teal-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 my-2 dark:focus:ring-green-800 hover:from-green-600 hover:to-teal-800 flex items-center justify-center disabled:from-green-500 disabled:to-teal-700"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader className="animate-spin" /> : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="w-full flex justify-center">
                            <div className="w-fit bg-green-500 p-5 mb-5 rounded-full">
                                <span>{<MailIcon  className="size-9 text-white"/>}</span>
                            </div>
                        </div>

                        <p className="text-center text-gray-300">
                       {`If an account exist for ${email}, you will receive a password reset link shortly.`}
                        </p>
                    </>
                )}
            </div>
            <div className="h-16 text-white bg-gray-900 flex items-center justify-center bg-opacity-50">
                <p className="text-gray-400 text-md">
                    <Link to="/login" className="text-green-500 text-md hover:underline flex items-center">
                        <ArrowLeft className="size-5 mr-1" /> Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
