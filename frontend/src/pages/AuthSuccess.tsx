import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                // Ensure it's valid JSON and has an ID
                const user = JSON.parse(userStr);
                if (!user.id) {
                    console.error('Login Error: No User ID received from backend', user);
                    alert('Login corrupted: User ID missing. Please contact dev.');
                    navigate('/login');
                    return;
                }

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user)); // Re-stringifying to be safe
                console.log('Login Success! User:', user);
                navigate('/');
            } catch (e) {
                console.error('Failed to parse user data', e);
                navigate('/login');
            }
        } else {
            console.warn('Missing token or user params');
            // navigate('/login'); // Commented out to see empty screen if params are missing for debug
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-4">
            <div className="text-xl font-semibold">Processing login...</div>
            <div className="text-sm text-gray-400">Please wait while we set up your session.</div>
        </div>
    );
};

export default AuthSuccess;
