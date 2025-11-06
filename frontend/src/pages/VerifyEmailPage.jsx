import { Loader } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    const { verifyEmail, isLoading, error } = useAuthStore();

    const handleVerify = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        try {
            const res = await verifyEmail(verificationCode);
            toast.success(res.data.message || "Email verified successfully");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (index, value) => {
        const newCode = [...code];

        // handle copy paste
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < newCode.length; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);

            // Focus on the last non empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((item) => item !== "");
            const focusedIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusedIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input field if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && index > 0 && !code[index]) {
            inputRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleVerify(new Event("submit"));
        }
    }, [code]);

    return (
        <div className="max-w-md w-full bg-gray-900 bg-opacity-70 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ">
            <div className="p-8">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                    Verify Your Email
                </h2>

                <p className="text-center text-gray-300 mb-6">Enter the 6-digit code sent to your email address</p>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-between">
                        {code?.map((item, index) => {
                            return (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength={6}
                                    value={item}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                                />
                            );
                        })}
                    </div>

                    {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full focus:outline-none text-white bg-gradient-to-r from-green-500 to-teal-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 my-2 dark:focus:ring-green-800 hover:from-green-600 hover:to-teal-800 flex items-center justify-center disabled:from-green-500 disabled:to-teal-700 disabled:opacity-50"
                        disabled={isLoading || code.some((digit) => digit === "")}
                    >
                        {isLoading ? <Loader className="animate-spin" /> : "Verify Email"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
