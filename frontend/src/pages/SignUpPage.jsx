import React, { useState } from "react";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const { signup, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signup(formData.email, formData.password, formData.username);
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ">
            <div className="p-8">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                    Create Account
                </h2>

                <form onSubmit={handleSignUp} action="">
                    <Input
                        type="text"
                        icon={User}
                        placeholder="Username"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <Input
                        type="email"
                        icon={Mail}
                        placeholder="Email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        type="password"
                        icon={Lock}
                        placeholder="Password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {
                        error && <p className="text-red-500 font-semibold mt-2">{error}</p>
                    }
                    <PasswordStrengthMeter password={formData?.password} />
                    <button
                        type="submit"
                        className="w-full focus:outline-none text-white bg-gradient-to-r from-green-500 to-teal-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 my-2 dark:focus:ring-green-800 hover:from-green-600 hover:to-teal-800 flex items-center justify-center disabled:from-green-500 disabled:to-teal-700"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin" /> : "Sign Up"}
                    </button>
                </form>
            </div>
            <div className="h-16 text-white bg-gray-900 flex items-center justify-center bg-opacity-50">
                <p className="text-gray-400 text-md">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
