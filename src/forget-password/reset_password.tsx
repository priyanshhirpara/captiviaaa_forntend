import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { FaEye, FaEyeSlash, FaLock, FaCheck, FaTimes } from "react-icons/fa";

const ResetPassword = () => {
    const { token } = useParams();
    const {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        message,
        successMessage,
        handleResetPassword,
        isLoading,
    } = useForgotPassword();

    // Local state for UI enhancements
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: "",
        color: "gray",
        strengthText: "Weak"
    });
    const [isValid, setIsValid] = useState(false);
    const [email, setEmail] = useState(""); // Will be extracted from token or API

    // Password strength checker
    const checkPasswordStrength = (password: string) => {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score += 1;
        else feedback.push("At least 8 characters");

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push("1 uppercase letter");

        if (/[a-z]/.test(password)) score += 1;
        else feedback.push("1 lowercase letter");

        if (/[0-9]/.test(password)) score += 1;
        else feedback.push("1 number");

        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push("1 special character");

        let color = "red";
        let strengthText = "Weak";

        if (score >= 4) {
            color = "green";
            strengthText = "Strong";
        } else if (score >= 3) {
            color = "yellow";
            strengthText = "Medium";
        } else if (score >= 2) {
            color = "orange";
            strengthText = "Fair";
        }

        return {
            score,
            feedback: feedback.join(", "),
            color,
            strengthText
        };
    };

    // Validation checker
    useEffect(() => {
        const strength = checkPasswordStrength(newPassword);
        setPasswordStrength(strength);

        const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
        const meetsRequirements = newPassword.length >= 8 && strength.score >= 3;
        
        setIsValid(passwordsMatch && meetsRequirements);
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        if (!token) {
            console.error("Invalid or missing token.");
        }
        // Here you could decode the token to get the email or fetch it from API
        // For now, we'll show a placeholder
        setEmail("user@example.com");
    }, [token]);

    const handleSubmit = async () => {
        if (!token || !isValid) {
            return;
        }
        await handleResetPassword(token);
    };

    const getStrengthColor = (color: string) => {
        switch (color) {
            case "red": return "bg-red-500";
            case "orange": return "bg-orange-500";
            case "yellow": return "bg-yellow-500";
            case "green": return "bg-green-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-white/80 text-sm">
                        Please enter your new password below.
                    </p>
                    {email && (
                        <p className="text-white/60 text-xs mt-2">
                            Account: {email.replace(/(.{2}).*(@.*)/, '$1***$2')}
                        </p>
                    )}
                </div>

                {/* Messages */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${
                        message.includes('successful') 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                        {message}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 p-3 rounded-lg text-sm bg-green-500/20 text-green-300 border border-green-500/30">
                        {successMessage}
                    </div>
                )}

                {/* New Password Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {newPassword && (
                        <div className="mt-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 w-8 rounded-full transition-all duration-300 ${
                                                level <= passwordStrength.score 
                                                    ? getStrengthColor(passwordStrength.color)
                                                    : 'bg-white/20'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className={`text-xs font-medium ${
                                    passwordStrength.color === 'green' ? 'text-green-400' :
                                    passwordStrength.color === 'yellow' ? 'text-yellow-400' :
                                    passwordStrength.color === 'orange' ? 'text-orange-400' :
                                    'text-red-400'
                                }`}>
                                    {passwordStrength.strengthText}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                    { text: 'At least 8 characters', met: newPassword.length >= 8 },
                                    { text: 'Lowercase letter', met: /[a-z]/.test(newPassword) },
                                    { text: 'Uppercase letter', met: /[A-Z]/.test(newPassword) },
                                    { text: 'Number', met: /[0-9]/.test(newPassword) },
                                    { text: 'Special character', met: /[^A-Za-z0-9]/.test(newPassword) }
                                ].map((req, index) => (
                                    <div key={index} className={`flex items-center space-x-1 ${req.met ? 'text-green-400' : 'text-white/40'}`}>
                                        {req.met ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                                        <span>{req.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-white/90 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-300 ${
                                confirmPassword && newPassword !== confirmPassword
                                    ? 'border-red-400/50'
                                    : confirmPassword && newPassword === confirmPassword
                                      ? 'border-green-400/50'
                                      : 'border-white/20'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {confirmPassword && (
                        <div className="mt-2">
                            {newPassword === confirmPassword ? (
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <FaCheck className="text-xs" /> Passwords match
                                </p>
                            ) : (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <FaTimes className="text-xs" /> Passwords don't match
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!isValid || isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        isValid && !isLoading
                            ? 'bg-gradient-to-r from-[#E94560] to-[#533483] hover:from-[#E94560]/90 hover:to-[#533483]/90 text-white hover:scale-105'
                            : 'bg-white/20 text-white/50 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating Password...
                        </div>
                    ) : (
                        'Update Password'
                    )}
                </button>

                {/* Back to Login Link */}
                <div className="text-center mt-6">
                    <Link 
                        to="/" 
                        className="text-[#E94560] hover:text-[#E94560]/80 text-sm font-medium transition-colors duration-200"
                    >
                        ← Back to Login
                    </Link>
                </div>

                {/* Security Note */}
                <div className="mt-6 p-3 bg-[#E94560]/10 rounded-lg border border-[#E94560]/20">
                    <p className="text-xs text-[#E94560]">
                        🔒 This reset link will expire in 30 minutes for security reasons.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
