import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendResetPasswordEmail,
    sendResetPasswordSuccessEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from "../mailtrap/emails.js";

const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 Hours
        });
        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);
        return res
            .status(201)
            .json({ success: true, message: "User created successfully", user: { ...user._doc, password: undefined } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findOne({ verificationToken: code, verificationTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const passwordMatched = await bcryptjs.compare(password, user.password);

        if (!passwordMatched) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        generateTokenAndSetCookie(res, user._id);
        return res
            .status(200)
            .json({ success: true, message: "Login successful", user: { ...user._doc, password: undefined } });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }
        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 Hour
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
        await user.save();
        //send emai
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`);
        return res.status(200).json({ success: true, message: "Password reset email sent successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid token" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        sendResetPasswordSuccessEmail(user.email);
        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, message: "User found", user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
};

export { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth };
