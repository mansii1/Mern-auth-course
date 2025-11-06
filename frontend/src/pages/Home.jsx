import React from "react";
import { useAuthStore } from "../store/authStore";
import moment from "moment";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user, isLoading, logout } = useAuthStore();
    const navigate = useNavigate()

    const handleLogOut = () => {
        const res = logout();
        toast.success(res.data.message)
        navigate("/login")
    };


    return (
        <div className="w-full ">
            <div className="max-w-[450px] mx-auto w-full bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                        Dashboard
                    </h2>

                    <div className="space-y-6 mb-4">
                        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 bg-opacity-50">
                            <h3 className="text-xl font-semibold text-green-400 mb-3">Profile Information</h3>
                            <p className="text-gray-300">Name : {user.name}</p>
                            <p className="text-gray-300">Email : {user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-4">
                        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 bg-opacity-50">
                            <h3 className="text-xl font-semibold text-green-400 mb-3">Account Activity</h3>
                            <p className="text-gray-300">
                                Joined :{" "}
                                {user?.createdAt ? moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a") : ""}
                            </p>
                            <p className="text-gray-300">
                                Last Login :{" "}
                                {user.lastLogin
                                    ? moment(user.lastLogin).format("MMMM Do YYYY, h:mm:ss a")
                                    : "You just signed up!"}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogOut}
                        type="submit"
                        className="w-full focus:outline-none text-white bg-gradient-to-r from-green-500 to-teal-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 my-2 dark:focus:ring-green-800 hover:from-green-600 hover:to-teal-800 flex items-center justify-center disabled:from-green-500 disabled:to-teal-700"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin" /> : "Logout"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
