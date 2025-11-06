import React, { useState } from "react";
import Input from "../components/Input";
import { Loader, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { isLoading, login, error } = useAuthStore();
    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await login(formData.email, formData.password);
        toast.success(res.data?.message);
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
                    Welcome Back
                </h2>

                <form onSubmit={handleLogin} action="">
                    <Input
                        type="email"
                        icon={Mail}
                        placeholder="Email Address"
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
                    <div className="flex items-center mb-6">
                        <Link to="/forgot-password" className="text-green-500 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

                    <button
                        type="submit"
                        className="w-full focus:outline-none text-white bg-gradient-to-r from-green-500 to-teal-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 my-2 dark:focus:ring-green-800 hover:from-green-600 hover:to-teal-800 flex items-center justify-center disabled:from-green-500 disabled:to-teal-700"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin" /> : "Login"}
                    </button>
                </form>
            </div>
            <div className="h-16 text-white bg-gray-900 flex items-center justify-center bg-opacity-50">
                <p className="text-gray-400 text-md">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-green-500 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
