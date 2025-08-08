import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../hooks/useAuth';

// Constants
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^[0-9]{10}$/
} as const;

const GRADIENT_COLORS = {
  primary: 'from-[#E94560] to-[#533483]',
  background: 'from-[#1A1A2E] via-[#16213E] to-[#0F3460]'
} as const;

// Types
interface LoginData {
  email?: string;
  mobile_number?: string;
  username?: string;
  password: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  loginData?: LoginData;
}

// Utility functions
const validateInput = (username: string, password: string): ValidationResult => {
  if (!username.trim()) {
    return { isValid: false, error: 'Please enter a username, mobile number, or email.' };
  }

  if (!password.trim()) {
    return { isValid: false, error: 'Password cannot be empty.' };
  }

  const loginData: LoginData = { password: password.trim() };

  if (VALIDATION_PATTERNS.email.test(username)) {
    loginData.email = username.trim();
  } else if (VALIDATION_PATTERNS.mobile.test(username)) {
    loginData.mobile_number = username.trim();
  } else if (username.length >= 3) {
    loginData.username = username.trim();
  } else {
    return { isValid: false, error: 'Enter a valid username, mobile number, or email.' };
  }

  return { isValid: true, loginData };
};

// Components
const FloatingShapes = () => (
  <>
    <div className="absolute top-20 left-20 w-32 h-32 bg-[#E94560]/10 rounded-full blur-xl animate-bounce"></div>
    <div className="absolute bottom-40 right-20 w-24 h-24 bg-[#533483]/20 rounded-full blur-lg animate-pulse"></div>
    <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#E94560]/15 rounded-full blur-md animate-spin"></div>
  </>
);

const FeatureHighlight = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3">
    <div className="w-2 h-2 bg-[#E94560] rounded-full"></div>
    <span className="text-gray-300">{text}</span>
  </div>
);

const BrandSection = () => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#E94560]/20 to-[#533483]/20 animate-pulse"></div>
    <FloatingShapes />

    <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
      <div className="text-center max-w-md">
        <h1 className={`text-5xl font-bold mb-6 bg-gradient-to-r ${GRADIENT_COLORS.primary} bg-clip-text text-transparent`}>
          New-Social
        </h1>
        <h2 className="text-3xl font-semibold mb-4">Connect. Share. Inspire.</h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          Join millions of people who use New-Social to share moments, connect with friends, and discover amazing content from around the world.
        </p>

        <div className="mt-8 space-y-4">
          <FeatureHighlight text="Share your stories with the world" />
          <FeatureHighlight text="Connect with friends and family" />
          <FeatureHighlight text="Discover trending content" />
        </div>
      </div>
    </div>
  </div>
);

const SocialLoginButton = () => (
  <button className="w-full flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105">
    <FaFacebook className="text-blue-500" />
    <span>Continue with Facebook</span>
  </button>
);

const Divider = () => (
  <div className="flex items-center my-6">
    <div className="flex-1 border-t border-white/20"></div>
    <span className="px-4 text-white/60 text-sm">or</span>
    <div className="flex-1 border-t border-white/20"></div>
  </div>
);

const InputField = ({
  type,
  placeholder,
  value,
  onChange,
  onKeyPress,
  icon
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  icon?: React.ReactNode;
}) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#E94560] focus:border-transparent transition-all duration-300 pr-12"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
    />
    {icon && (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200">
        {icon}
      </div>
    )}
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm">
    {message}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center space-x-2">
    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
    <span>Signing in...</span>
  </div>
);

const AppDownloadSection = () => (
  <div className="mt-8 text-center lg:hidden">
    <p className="text-white/60 text-sm mb-4">Get the app</p>
    <div className="flex justify-center space-x-3">
      <a
        href="https://play.google.com/store/apps/details?id=com.instagram.android&hl=en_IN&pli=1"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transition-transform duration-200"
      >
        <img src="/images/google_pay.png" alt="Google Play" className="h-12" />
      </a>
      <a
        href="https://apps.microsoft.com/detail/9nblggh5l9xt?hl=en-GB&gl=IN"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transition-transform duration-200"
      >
        <img src="/images/microsofwt.jpeg" alt="Microsoft Store" className="h-12" />
      </a>
    </div>
  </div>
);

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    showPassword: false,
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLogin = useCallback(async () => {
    setError('');
    setIsLoading(true);

    const validation = validateInput(formData.username, formData.password);

    if (!validation.isValid) {
      setError(validation.error!);
      setIsLoading(false);
      return;
    }

    const loginSuccess = await login(validation.loginData!);
    setIsLoading(false);

    if (loginSuccess) {
      navigate('/home');
    }
  }, [formData.username, formData.password, navigate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }, [handleLogin]);

  const passwordIcon = useMemo(() => (
    <button
      type="button"
      onClick={() => handleInputChange('showPassword', !formData.showPassword)}
    >
      {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  ), [formData.showPassword, handleInputChange]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  }, [handleLogin]);

  return (
    <div className={`flex min-h-screen bg-gradient-to-br ${GRADIENT_COLORS.background}`}>
      <BrandSection />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="lg:hidden text-center mb-8">
              <h1 className={`text-3xl font-bold bg-gradient-to-r ${GRADIENT_COLORS.primary} bg-clip-text text-transparent`}>
                New-Social
              </h1>
            </div>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

            <div className="space-y-3 mb-6">
              <SocialLoginButton />
            </div>

            <Divider />

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                type="text"
                placeholder="Username, email, or phone"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onKeyPress={handleKeyPress}
              />

              <InputField
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onKeyPress={handleKeyPress}
                icon={passwordIcon}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-white/80">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="w-4 h-4 text-[#E94560] bg-white/10 border-white/20 rounded focus:ring-[#E94560] focus:ring-2"
                  />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link
                  to="/forget-password"
                  className="text-sm text-[#E94560] hover:text-[#E94560]/80 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </div>

              {error && <ErrorMessage message={error} />}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${GRADIENT_COLORS.primary} hover:from-[#E94560]/90 hover:to-[#533483]/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center`}
              >
                {isLoading ? <LoadingSpinner /> : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#E94560] hover:text-[#E94560]/80 font-semibold transition-colors duration-200"
              >
                Sign up
              </Link>
            </p>
          </div>

          <AppDownloadSection />
        </div>
      </div>
    </div>
  );
};

export default Login;
