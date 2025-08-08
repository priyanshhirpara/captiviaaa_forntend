import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  FaFacebook,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaTimes,
  FaHeart,
  FaComments,
  FaImage
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

const SignupPage = () => {
  const { signup, getUsernameSuggestions, createPersonalInfo } = useAuth();
  const [formData, setFormData] = useState({
    contact: "",
    password: "",
    fullname: "",
    username: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  // Check for dark mode preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
  }, []);

  // Personalized greeting
  useEffect(() => {
    if (formData.fullname.trim()) {
      const firstName = formData.fullname.split(' ')[0];
      setGreeting(`Hi ${firstName}, welcome! 👋`);
    } else {
      setGreeting("");
    }
  }, [formData.fullname]);

  // Password strength calculation
  useEffect(() => {
    const password = formData.password;
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [formData.password]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "username") {
      console.log("Fetching username suggestions for:", value);
      try {
        const response = await getUsernameSuggestions(value)
        console.log("Username suggestions:", response);
        if (response && Array.isArray(response)) {
          setUsernameSuggestions(response);
        } else {
          setUsernameSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching username suggestions:", error);
        setUsernameSuggestions([]);
      }
    }
  };



  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prevData) => ({
      ...prevData,
      username: suggestion,
    }));
    setUsernameSuggestions([]);
  };

  const validateForm = () => {
    const isEmail = /\S+@\S+\.\S+/.test(formData.contact);
    const isMobileNumber = /^\d{10}$/.test(formData.contact);

    if (!isEmail && !isMobileNumber) {
      setError("Please enter a valid mobile number or email.");
      return false;
    }

    if (formData.username.trim() === "") {
      setError("Username is required.");
      return false;
    }
    if (/\s/.test(formData.username)) {
      setError("Username cannot contain spaces.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isEmail = /\S+@\S+\.\S+/.test(formData.contact);
    const requestBody = {
      username: formData.username,
      fullname: formData.fullname,
      password: formData.password,
      ...(isEmail
        ? { email: formData.contact }
        : { mobile_number: formData.contact }),
    };
    const signupSuccess = await signup(requestBody);
    if (signupSuccess) {
      console.log("Signup successful");
      
      const personalInfoSuccess = await createPersonalInfo({
        profile_picture: "/images/default.jpg",
        bio: "",
        website: "",
      });
      
      if (personalInfoSuccess) {
        console.log("Personal information created");
        navigate("/settings");
      }
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Fair";
    return "Strong";
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 animate-bounce">
            <FaHeart className="text-white/20 text-4xl" />
          </div>
          <div className="absolute top-40 right-32 animate-pulse">
            <FaComments className="text-white/20 text-3xl" />
          </div>
          <div className="absolute bottom-32 left-32 animate-bounce">
            <FaImage className="text-white/20 text-4xl" />
          </div>
          <div className="absolute bottom-20 right-20 animate-pulse">
            <FaHeart className="text-white/20 text-3xl" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center max-w-md">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              New-social
            </h1>
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Join the conversation. Share your world. Connect with friends and discover amazing content.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaHeart className="text-pink-300" />
                <span>Share your moments</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaComments className="text-blue-300" />
                <span>Connect with friends</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaImage className="text-green-300" />
                <span>Discover amazing content</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              New-social
            </h1>
          </div>

          {/* Personalized Greeting */}
          {greeting && (
            <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
              <p className="text-teal-700 dark:text-teal-300 font-medium">{greeting}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <FaFacebook className="mr-3 text-blue-600" />
              Continue with Facebook
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>


            {/* Full Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>

            {/* Username */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white transition-all"
              />
              {usernameSuggestions.length > 0 && (
                <div className="absolute left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 z-10">
                  <div className="flex flex-wrap gap-2">
                    {usernameSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-full border border-gray-300 dark:border-gray-600 cursor-pointer transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Email or Mobile Number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white transition-all"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${passwordStrength <= 2 ? 'text-red-500' :
                      passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { text: 'At least 8 characters', met: formData.password.length >= 8 },
                    { text: 'Lowercase letter', met: /[a-z]/.test(formData.password) },
                    { text: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
                    { text: 'Number', met: /[0-9]/.test(formData.password) },
                    { text: 'Special character', met: /[^A-Za-z0-9]/.test(formData.password) }
                  ].map((req, index) => (
                    <div key={index} className={`flex items-center space-x-1 ${req.met ? 'text-green-500' : 'text-gray-400'
                      }`}>
                      {req.met ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
                      <span>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:text-white transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-300 dark:border-red-600'
                    : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-300 dark:border-green-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Terms and Privacy */}
            <div className="text-xs text-gray-600 dark:text-gray-400">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-teal-500 hover:underline">Terms of Service</Link>,{" "}
              <Link to="/privacy" className="text-teal-500 hover:underline">Privacy Policy</Link>, and{" "}
              <Link to="/cookies" className="text-teal-500 hover:underline">Cookie Policy</Link>.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/" className="text-teal-500 hover:text-teal-600 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
