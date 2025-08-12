import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


// Types
export interface UseForgotPasswordReturn {
  input: string;
  setInput: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  emailSent: boolean;
  setEmailSent: (value: boolean) => void;
  isLoading: boolean;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  token: string;
  setToken: (value: string) => void;
  successMessage: string;
  setSuccessMessage: (value: string) => void;
  handleSendOtp: () => Promise<void>;
  resetState: () => void;
  handleResetPassword: (token: string) => Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const accessToken = Cookies.get('access_token');

// API functions
const sendForgotPasswordEmail = async (email: string): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/forgot-password/`, { email });
  return response.data;
};

const resetPassword = async (password: string): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/reset-password/`, 
    { password },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendOtp = async (): Promise<void> => {
    if (!input) {
      setMessage('Please enter an email!');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      await sendForgotPasswordEmail(input);
      
      setEmailSent(true);
      setMessage('A password reset link has been sent to your email!');
    } catch (error: any) {
      console.error('Error sending email:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await resetPassword(newPassword);
      
      setSuccessMessage("Password reset successful! Please log in.");
      setMessage("");
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      setMessage(errorMessage);
    }
  };

  const resetState = (): void => {
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
