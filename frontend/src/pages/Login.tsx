import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const Login = () => {
    const handleLogin = async () => {
        try {
            // Fetch the Google Auth URL from the backend
            const res = await axios.get('http://localhost:3000/api/auth/login');
            // Redirect the browser to Google's OAuth page
            window.location.href = res.data.url;
        } catch (error) {
            console.error('Login failed', error);
            alert('Failed to initialize login. Is the backend running?');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#111827]">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#1F2937] rounded-xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">ReachInbox</h2>
                    <p className="mt-2 text-sm text-gray-400">Sign in to manage your campaigns</p>
                </div>

                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                    >
                        <FcGoogle className="w-6 h-6 mr-3" />
                        Sign in with Google
                    </button>

                    <button
                        onClick={() => window.location.href = 'http://localhost:3000/api/auth/mock-login'}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 text-base font-medium rounded-md text-gray-300 bg-[#374151] hover:bg-[#4B5563] transition-colors duration-200 shadow-sm"
                    >
                        Guest Login (Dev)
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#1F2937] text-gray-400">Protected & Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
