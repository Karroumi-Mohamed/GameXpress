import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);


        const data = {
            email: email,
            password: password,
        };

        try {
            await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
            console.log('CSRF cookie requested');

            const loginResponse = await api.post('/login', data);
            console.log('Login successful:', loginResponse.data);

            const userResponse = await api.get('/user');
            const userData = userResponse.data;
            console.log('User data:', userData);
            auth.setUser(userData);
            toast.success(`Welcome back, ${userData?.name || 'User'}!`);
            navigate('/admin');

        } catch (err: any) {
            console.error('Authentication failed:', err);
            let errorMessage = err.message || 'An unknown error occurred';
            if (err.response) {
                errorMessage = `Error ${err.response.status}: ${err.response.data?.message || err.message}`;
                 if (err.response.status === 401) {
                    errorMessage = 'Unauthorized: Could not fetch user data after login. Check credentials or session.';
                } else if (err.response.status === 419) {
                    errorMessage = 'CSRF token mismatch or session expired. Please refresh and try again.';
                } else if (err.response.status === 422) {
                    const errors = err.response.data?.errors;
                    if (errors) {
                        errorMessage = 'Validation Error: ' + Object.values(errors).flat().join(' ');
                    } else {
                         errorMessage = 'Validation Error: Please check your input.';
                    }
                } else if (err.request) {
                     errorMessage = 'No response from server. Check network connection or server status.';
                }
            }
             setError(errorMessage);
             toast.error(errorMessage || 'Login failed. Please try again.');
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Admin Login</h1>
                <p className="text-center text-slate-500 mb-8">Access your GameXpress dashboard</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            className="block w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            className="block w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition duration-150 ease-in-out"
                    >
                        Sign in
                    </button>
                     <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
