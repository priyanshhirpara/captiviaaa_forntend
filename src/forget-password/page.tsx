import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        try {
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address.');
                return;
            }

            // Here you would typically make an API call to send reset email
            console.log('Reset password for:', email);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center justify-center border border-gray-300 p-8 bg-white rounded-lg shadow-sm w-full max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <FaEnvelope className="text-green-600" size={24} />
                    </div>

                    <h1 className="text-2xl font-bold mb-4 text-center">Check Your Email</h1>

                    <p className="text-gray-600 text-center mb-6">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>

                    <p className="text-sm text-gray-500 text-center mb-6">
                        Didn't receive the email? Check your spam folder or try again.
                    </p>

                    <Link
                        to="/"
                        className="w-full py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium text-center"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center justify-center border border-gray-300 p-8 bg-white rounded-lg shadow-sm w-full max-w-md">
                <Link
                    to="/"
                    className="self-start mb-6 flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Login
                </Link>

                <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>

                <p className="text-gray-600 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <div className="w-full space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full p-3 border text-sm border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />

                    <button
                        className={`w-full py-3 px-4 text-white rounded-md font-medium transition-colors ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                            }`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>

                {error && (
                    <div className="w-full mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/" className="text-blue-500 hover:text-blue-600 hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
