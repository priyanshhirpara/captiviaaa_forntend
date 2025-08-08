import Cookies from 'js-cookie';
import axios from 'axios';

interface LoginData {
    email?: string;
    mobile_number?: string;
    username?: string;
    password: string;
}

const LoginFunction = async (loginData: LoginData,setError: (error: string) => void): Promise<boolean> => {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

    try {
        const response = await axios.post(`${API_BASE_URL}/login`, loginData);

        if (response.status !== 200) {
            const errorData = response.data as { message?: string };
            setError(errorData.message || 'Failed to log in. Please try again.');
            return false;
        }

        const data = response.data as { token: string };
        Cookies.set('access_token', data.token, { expires: 3 });
        localStorage.setItem('loginData', JSON.stringify(loginData));
        return true;
    } catch (error) {
        console.error('Error during login:', error);
        setError('An error occurred. Please try again later.');
        return false;
    }
};

export default LoginFunction;