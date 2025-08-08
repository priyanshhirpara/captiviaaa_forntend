import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Types
export interface User {
  id: number;
  username: string;
  fullname: string;
  email?: string;
  mobile_number?: string;
  profile_picture?: string;
  bio?: string;
  website?: string;
}

export interface LoginData {
  email?: string;
  mobile_number?: string;
  username?: string;
  password: string;
}

export interface SignupData {
  username: string;
  fullname: string;
  password: string;
  email?: string;
  mobile_number?: string;
}

export interface PersonalInfoData {
  profile_picture: string;
  bio: string;
  website: string;
}

import { apiClient, API_ENDPOINTS, isAuthenticated, handleError } from './apiClient';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    const token = Cookies.get('access_token');
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.get('/me');
      setCurrentUser(response.data as User);
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

      const response = await apiClient.post('/login', loginData);
      
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

      const response = await apiClient.post('/signup', signupData);
      
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

      const response = await apiClient.post('/personal-information/', personalInfoData);
      
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
  const isAuthenticated = (): boolean => {
    return !!Cookies.get('access_token');
  };

  // Get username suggestions
  const getUsernameSuggestions = async (baseName: string): Promise<string[]> => {
    if (baseName.length < 3) {
      return [];
    }

    try {
      const response = await apiClient.get(`/username-suggestions/?base_name=${baseName}`);
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
    isAuthenticated,
    getUsernameSuggestions,
    fetchCurrentUser,
  };
};
