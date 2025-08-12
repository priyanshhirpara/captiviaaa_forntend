import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { User, LoginData, SignupData, PersonalInfoData } from '../types/userTypes';
import type { CurrentUser } from '../types/posttypes';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    const accessToken = Cookies.get("access_token");
    if (!accessToken) {
      setCurrentUser(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCurrentUser(response.data as CurrentUser);
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Failed to fetch user data');
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/login`, loginData);

      if (response.status === 200) {
        const { token } = response.data as { token: string };
        Cookies.set('access_token', token, { expires: 3 });
        localStorage.setItem('loginData', JSON.stringify(loginData));

        // Fetch user data after successful login
        await fetchCurrentUser();
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (signupData: SignupData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/signup`, signupData);

      if (response.status === 200 || response.status === 201) {
        const { token } = response.data as { token: string };
        Cookies.set('access_token', token, { expires: 3 });

        // Fetch user data after successful signup
        await fetchCurrentUser();
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create personal information
  const createPersonalInfo = async (personalInfoData: PersonalInfoData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const token = Cookies.get('access_token');
      const response = await axios.post(`${API_BASE_URL}/personal-information/`, personalInfoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Update current user with new personal info
        await fetchCurrentUser();
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save personal information.';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem('loginData');
    setCurrentUser(null);
    setError(null);
  };

  // Check if user is authenticated
  const checkAuth = (): boolean => {
    return !!Cookies.get('access_token');
  };

  // Get username suggestions
  const getUsernameSuggestions = async (baseName: string): Promise<string[]> => {
    if (baseName.length < 3) {
      return [];
    }

    try {
      const token = Cookies.get('access_token');
      const response = await axios.get(`${API_BASE_URL}/username-suggestions/?base_name=${baseName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return (response.data as { suggestions: string[] }).suggestions || [];
    } catch (err: any) {
      console.error('Error fetching username suggestions:', err);
      return [];
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return {
    currentUser,
    isLoading,
    error,
    login,
    signup,
    createPersonalInfo,
    logout,
    checkAuth,
    getUsernameSuggestions,
    fetchCurrentUser,
  };
};