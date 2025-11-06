import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [{ email }];
    try {
        await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipients = [{ email }];
    try {
        await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "e1058a0d-0cc3-4000-bd49-4835b696d3de",
            template_variables: {
                company_info_name: "Auth Company",
                name,
            },
        });
    } catch (error) {
        throw new Error(error);
    }
};

export const sendResetPasswordEmail = async (email, resetUrl) => {
    const recipients = [{ email }];
     try {
         await mailtrapClient.send({
             from: sender,
             to: recipients,
             subject: "Reset your password",
             html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
             category: "Password Reset",
         });
     } catch (error) {
         throw new Error(error);
     }
};

export const sendResetPasswordSuccessEmail = async (email) => {
    const recipients = [{ email }];
    try {
        await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });
    } catch (error) {
        throw new Error(error);
    }
};
