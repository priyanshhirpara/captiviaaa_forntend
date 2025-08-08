import { useState } from 'react';

// You'll need to define this constant or import it from your config
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useForgetPassword = () => {
    const [input, setInput] = useState('');
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSendOtp = async () => {
        if (!input) {
            setMessage('Please enter an email!');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'email': input }),
            });

            const data = await response.json();
            console.log('Response message:', data.message);

            if (response.ok) {
                setEmailSent(true);
                setMessage('A password reset link has been sent to your email!');
            } else {
                if (!data.message) {
                    setMessage('The email you provided is incorrect. Please try again.');
                } else {
                    setMessage(data.message || 'Error sending email.');
                }
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setMessage('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (token: string) => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/reset-password/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ 'password': newPassword }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Password reset successful! Please log in.");
                setMessage("");
            } else {
                setMessage(data.message || "Error resetting password.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("Something went wrong. Please try again.");
        }
    };

    const resetState = () => {
        setInput('');
        setMessage('');
        setEmailSent(false);
        setIsLoading(false);
        setNewPassword('');
        setConfirmPassword('');
        setToken('');
        setSuccessMessage('');
    };

    return {
        input,
        setInput,
        message,
        setMessage,
        emailSent,
        setEmailSent,
        isLoading,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        token,
        setToken,
        successMessage,
        setSuccessMessage,
        handleSendOtp,
        resetState,
        handleResetPassword,
    };
};