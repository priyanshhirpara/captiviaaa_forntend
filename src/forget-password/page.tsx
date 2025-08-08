import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaLock, FaCheck, FaShieldAlt } from 'react-icons/fa';
import { useForgotPassword } from '../hooks/useForgotPassword';

const ForgetPassword = () => {
    const {
        input: email,
        setInput: setEmail,
        message: error,
        setMessage: setError,
        emailSent: success,
        setEmailSent: setSuccess,
        isLoading,
        handleSendOtp,
        resetState
    } = useForgotPassword();

    const [currentStep, setCurrentStep] = useState(1);
    const [iconAnimation, setIconAnimation] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setIconAnimation(true);

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            setIconAnimation(false);
            return;
        }

        await handleSendOtp();
        setIconAnimation(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    // Animated background gradient
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth) * 100;
            const y = (clientY / window.innerHeight) * 100;
            
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F5F6FA] via-[#00ADB5] to-[#F8B400] opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#00ADB5] to-[#F8B400] opacity-20"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-[#00ADB5] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#F8B400] rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#00ADB5] rounded-full opacity-25 animate-ping"></div>

                {/* Glass Card */}
                <div className="relative z-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
                    <div className="text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-gradient-to-br from-[#00ADB5] to-[#F8B400] rounded-full flex items-center justify-center mx-auto mb-6 transform scale-100 animate-pulse">
                            <FaCheck className="text-white text-3xl" />
                        </div>

                        <h1 className="text-3xl font-bold mb-4 text-[#222831]">Check Your Email</h1>
                        
                        <div className="space-y-4 mb-8">
                            <p className="text-[#222831] text-lg">
                                We've sent a password reset link to
                            </p>
                            <p className="text-[#00ADB5] font-semibold text-lg break-all">
                                {email}
                            </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex justify-center items-center space-x-4 mb-8">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-[#00ADB5] rounded-full flex items-center justify-center">
                                    <FaCheck className="text-white text-sm" />
                                </div>
                                <span className="ml-2 text-sm text-[#222831] font-medium">Email Sent</span>
                            </div>
                            <div className="w-8 h-1 bg-[#00ADB5] rounded"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">2</span>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">Check Email</span>
                            </div>
                            <div className="w-8 h-1 bg-gray-300 rounded"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">3</span>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">Reset Password</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-[#222831]/70">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button 
                                    className="text-[#00ADB5] hover:text-[#F8B400] font-medium underline"
                                    onClick={() => {
                                        resetState();
                                        setCurrentStep(1);
                                    }}
                                >
                                    try again
                                </button>
                            </p>

                            <Link
                                to="/"
                                className="block w-full py-4 px-6 bg-gradient-to-r from-[#00ADB5] to-[#F8B400] text-white rounded-xl hover:from-[#F8B400] hover:to-[#00ADB5] transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F6FA] via-[#00ADB5] to-[#F8B400] opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#00ADB5] to-[#F8B400] opacity-20"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-[#00ADB5] rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#F8B400] rounded-full opacity-30 animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#00ADB5] rounded-full opacity-25 animate-ping"></div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl mx-4">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Form */}
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
                        <Link
                            to="/"
                            className="inline-flex items-center text-[#00ADB5] hover:text-[#F8B400] transition-colors mb-8 font-medium"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Login
                        </Link>

                        <div className="text-center mb-8">
                            {/* Animated Icon */}
                            <div className={`w-20 h-20 bg-gradient-to-br from-[#00ADB5] to-[#F8B400] rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-500 ${iconAnimation ? 'scale-110 rotate-12' : 'scale-100'}`}>
                                {iconAnimation ? (
                                    <FaEnvelope className="text-white text-3xl animate-pulse" />
                                ) : (
                                    <FaLock className="text-white text-3xl" />
                                )}
                            </div>

                            <h1 className="text-4xl font-bold mb-4 text-[#222831]">Reset your password</h1>
                            <p className="text-[#222831]/70 text-lg">
                                Enter your email or username to receive a reset link.
                            </p>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex justify-center items-center space-x-4 mb-8">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-[#00ADB5] rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">1</span>
                                </div>
                                <span className="ml-2 text-sm text-[#222831] font-medium">Enter Email</span>
                            </div>
                            <div className="w-8 h-1 bg-gray-300 rounded"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">2</span>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">Check Email</span>
                            </div>
                            <div className="w-8 h-1 bg-gray-300 rounded"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 text-sm">3</span>
                                </div>
                                <span className="ml-2 text-sm text-gray-500">Reset Password</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full p-4 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ADB5] focus:border-transparent bg-white/20 backdrop-blur-sm text-[#222831] placeholder-[#222831]/50 transition-all duration-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#00ADB5] to-[#F8B400] hover:from-[#F8B400] hover:to-[#00ADB5] text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                                }`}
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50/50 border border-red-200/50 rounded-xl backdrop-blur-sm">
                                <p className="text-red-600 text-center">{error}</p>
                            </div>
                        )}

                        <div className="mt-8 text-center space-y-4">
                            <p className="text-sm text-[#222831]/70">
                                Remember your password?{' '}
                                <Link to="/" className="text-[#00ADB5] hover:text-[#F8B400] font-medium underline">
                                    Log in
                                </Link>
                            </p>
                            
                            <div className="flex items-center justify-center space-x-2 text-sm text-[#222831]/60">
                                <FaShieldAlt className="text-[#00ADB5]" />
                                <span>We'll never ask for your password via email</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Illustration */}
                    <div className="hidden lg:block text-center">
                        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
                            <div className="w-64 h-64 mx-auto mb-6 relative">
                                {/* Animated Security Illustration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#00ADB5]/20 to-[#F8B400]/20 rounded-full animate-pulse"></div>
                                <div className="absolute inset-4 bg-gradient-to-br from-[#00ADB5]/30 to-[#F8B400]/30 rounded-full animate-bounce"></div>
                                <div className="absolute inset-8 bg-gradient-to-br from-[#00ADB5]/40 to-[#F8B400]/40 rounded-full animate-ping"></div>
                                
                                {/* Lock Icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaLock className="text-[#00ADB5] text-6xl animate-pulse" />
                                </div>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-[#222831] mb-4">Secure Password Reset</h2>
                            <p className="text-[#222831]/70 text-lg">
                                Your security is our priority. We use industry-standard encryption to protect your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
