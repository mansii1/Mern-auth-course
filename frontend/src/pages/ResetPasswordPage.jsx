import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Loader, Lock } from "lucide-react";
import Input from "../components/Input";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
    const { isLoading, error, resetPassword, message } = useAuthStore();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: "",
        cPassword: "",
    });
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData?.password !== formData?.cPassword) {
            alert("Password do not match");
            return;
        }
        try {
            await resetPassword(token, formData.password);
            toast.success("Password reset successfully, redirecting to login page...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            toast.error(error.message || "Error resetting password")
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
                    Reset password
                </h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        type="password"
                        icon={Lock}
                        placeholder="New Password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Input
                        type="password"
                        icon={Lock}
                        placeholder="Confirm New Password"
                        name="cPassword"
                        required
                        value={formData.cPassword}
                        onChange={handleChange}
                    />

                    {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
                    {message && <p className="text-green-500 font-semibold mb-4">{message}</p>}

                    <button
                        type="submit"
                        className="w-full focus:outline-none text-white bg-gradient-to-r from-green-500 to-teal-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 my-2 dark:focus:ring-green-800 hover:from-green-600 hover:to-teal-800 flex items-center justify-center disabled:from-green-500 disabled:to-teal-700"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin" /> : "Set New Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
