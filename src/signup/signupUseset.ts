import axios from "axios";

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Types for API requests and responses
export interface SignupRequest {
    username: string;
    fullname: string;
    password: string;
    email?: string;
    mobile_number?: string;
}

export interface SignupResponse {
    token: string;
    user: {
        id: number;
        username: string;
        fullname: string;
        email?: string;
        mobile_number?: string;
    };
}

export interface PersonalInfoRequest {
    profile_picture: string;
    bio: string;
    website: string;
}

export interface PersonalInfoResponse {
    id: number;
    profile_picture: string;
    bio: string;
    website: string;
    user: number;
}

export interface UsernameSuggestionsResponse {
    suggestions: string[];
}

export interface ValidationResponse {
    is_available: boolean;
    message?: string;
}

// API endpoints configuration
export const signupEndpoints = {
    // Main signup endpoint
    signup: `${API_BASE_URL}/signup`,

    // Username-related endpoints
    usernameSuggestions: `${API_BASE_URL}/username-suggestions`,

    // Personal information endpoint
    personalInformation: `${API_BASE_URL}/personal-information/`,
};

// API service functions
export const signupAPI: {
    signup: (data: SignupRequest) => Promise<SignupResponse>;
    getUsernameSuggestions: (baseName: string) => Promise<UsernameSuggestionsResponse>;
    createPersonalInfo: (data: PersonalInfoRequest, token: string) => Promise<PersonalInfoResponse>;
} = {
    // Main signup function
    async signup(data: SignupRequest): Promise<SignupResponse> {
        const response = await axios.post(signupEndpoints.signup, data);
        return response.data as SignupResponse;
    },

    // Get username suggestions
    async getUsernameSuggestions(baseName: string): Promise<UsernameSuggestionsResponse> {
        if (baseName.length < 3) {
            return { suggestions: [] };
        }
        else {
            console.log("Base name is:", baseName);
            const response = await axios.get(`${signupEndpoints.usernameSuggestions}/?base_name=${baseName}`);
            console.log("Response:", (response.data as any).suggestions);
            return (response.data as any).suggestions;
        }
    },


    // Create personal information
    async createPersonalInfo(data: PersonalInfoRequest, token: string): Promise<PersonalInfoResponse> {
        const response = await axios.post(signupEndpoints.personalInformation, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data as PersonalInfoResponse;
    },
};

// Utility functions for signup process
export const signupUtils: {
    isValidEmail: (email: string) => boolean;
    isValidPhoneNumber: (phone: string) => boolean;
    isValidUsername: (username: string) => boolean;
    validatePassword: (password: string) => {
        isValid: boolean;
        strength: number;
        errors: string[];
    };
    generateUsernameSuggestions: (baseName: string) => string[];
    formatPhoneNumber: (phone: string) => string;
    getPasswordStrengthText: (strength: string) => string;
    getPasswordStrengthColor: (strength: string) => string;
} = {
    // Validate email format
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate phone number format (10 digits)
    isValidPhoneNumber(phone: string): boolean {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    },

    // Validate username format
    isValidUsername(username: string): boolean {
        // Username should be 3-30 characters, alphanumeric and underscores only
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    },

    // Validate password strength
    validatePassword(password: string): {
        isValid: boolean;
        strength: number;
        errors: string[];
    } {
        const errors: string[] = [];
        let strength = 0;

        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        } else {
            strength += 1;
        }

        if (/[a-z]/.test(password)) {
            strength += 1;
        } else {
            errors.push("Password must contain at least one lowercase letter");
        }

        if (/[A-Z]/.test(password)) {
            strength += 1;
        } else {
            errors.push("Password must contain at least one uppercase letter");
        }

        if (/[0-9]/.test(password)) {
            strength += 1;
        } else {
            errors.push("Password must contain at least one number");
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 1;
        } else {
            errors.push("Password must contain at least one special character");
        }

        return {
            isValid: errors.length === 0,
            strength,
            errors
        };
    },

    // Generate username suggestions
    generateUsernameSuggestions(baseName: string): string[] {
        const suggestions: string[] = [];
        const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        if (cleanName.length >= 3) {
            suggestions.push(cleanName);
            suggestions.push(`${cleanName}${Math.floor(Math.random() * 1000)}`);
            suggestions.push(`${cleanName}_${Math.floor(Math.random() * 1000)}`);
            suggestions.push(`${cleanName}${new Date().getFullYear()}`);
        }

        return suggestions;
    },

    // Format phone number for display
    formatPhoneNumber(phone: string): string {
        if (phone.length === 10) {
            return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
        }
        return phone;
    },

    // Get password strength text
    getPasswordStrengthText(strength: string): string {
        if (strength === "2") return "Weak";
        if (strength === "3") return "Fair";
        if (strength === "4") return "Good";
        return "Strong";
    },

    // Get password strength color
    getPasswordStrengthColor(strength: string): string {
        if (strength === "2") return "bg-red-500";
        if (strength === "3") return "bg-yellow-500";
        if (strength === "4") return "bg-blue-500";
        return "bg-green-500";
    }
};

// Error handling utilities
export const signupErrorHandler = {
    // Handle API errors
    handleAPIError(error: any): string {
        if (error.response?.data?.detail) {
            return error.response.data.detail;
        }
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.message) {
            return error.message;
        }
        return "An unexpected error occurred. Please try again.";
    },

    // Get specific error messages for validation
    getValidationError(field: string, value: string): string | null {
        switch (field) {
            case 'email':
                if (!signupUtils.isValidEmail(value)) {
                    return "Please enter a valid email address";
                }
                break;
            case 'phone':
                if (!signupUtils.isValidPhoneNumber(value)) {
                    return "Please enter a valid 10-digit phone number";
                }
                break;
            case 'username':
                if (!signupUtils.isValidUsername(value)) {
                    return "Username must be 3-30 characters, letters, numbers, and underscores only";
                }
                break;
            case 'password':
                const passwordValidation = signupUtils.validatePassword(value);
                if (!passwordValidation.isValid) {
                    return passwordValidation.errors[0];
                }
                break;
        }
        return null;
    }
};

export default {
    signupEndpoints,
    signupAPI,
    signupUtils,
    signupErrorHandler
};
