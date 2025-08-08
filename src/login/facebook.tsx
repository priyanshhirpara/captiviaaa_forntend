import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaArrowLeft } from 'react-icons/fa';

const FacebookLogin = () => {
  const handleFacebookLogin = () => {
    // Facebook login implementation would go here
    console.log('Facebook login clicked');
  };

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
        
        <h1 className="text-2xl font-bold mb-8 text-center">Login with Facebook</h1>
        
        <button
          onClick={handleFacebookLogin}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
        >
          <FaFacebook className="mr-3" size={20} />
          Continue with Facebook
        </button>
        
        <p className="text-sm text-gray-600 mt-4 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default FacebookLogin;
