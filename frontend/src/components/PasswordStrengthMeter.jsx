import { Check, X } from "lucide-react";
import React from "react";

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /\d/.test(password) },
        { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
        <div className="mt-2 space-y-1">
            {criteria?.map((item) => {
                return (
                    <div key={item?.label} className="flex items-center text-xs">
                        {item?.met ? <Check className="text-green-500 mr-2" /> : <X className="text-gray-500 mr-2" />}
                        <span className={item?.met ? "text-green-500" : "text-gray-400"}>{item?.label}</span>
                    </div>
                );
            })}
        </div>
    );
};
const PasswordStrengthMeter = ({ password }) => {
    const getStrength = (pass) => {
        let strength = 0;
        if (pass?.length >= 6) strength++;
        if (pass?.match(/[A-Z]/) && pass?.match(/[a-z]/)) strength++;
        if (pass?.match(/\d/)) strength++;
        if (pass?.match(/[^A-Za-z0-9]/)) strength++;
        return strength;
    };
    const strength = getStrength(password);

    const getStrengthText = (strength) => {
        if (strength === 0) return "Very Weak";
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        return "Strong";
    };

    const strengthText = getStrengthText(strength);

    const getColor = (strength) => {
        if (strength === 0) return "bg-red-500";
        if (strength === 1) return "bg-red-400";
        if (strength === 2) return "bg-yellow-500";
        if (strength === 3) return "bg-yellow-400";
        return "bg-green-500";
    };

    const color = getColor(strength);
    return (
        <div className="my-2">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Password Strength</span>
                <span className={`text-xs text-gray-400`}>{strengthText}</span>
            </div>

            <div className="flex space-x-1">
                {[...Array(4)].map((_, index) => {
                        return (
                            <div
                                key={index}
                                className={`w-1/4 h-1 rounded-full transition-colors duration-300  ${
                                    index < strength ? color : "bg-gray-500"
                                }`}
                            ></div>
                        );
                    })
                }
            </div>
            <PasswordCriteria password={password} />
        </div>
    );
};

export default PasswordStrengthMeter;
