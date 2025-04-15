import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios.js';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        setIsLoading(true);

        const data = {
            name: name,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
        };

        try {
            await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });

            const response = await api.post('/register', data);

            console.log('Registration successful:', response.data);
            toast.success('Registration successful! Please log in.');
            navigate('/login');

        } catch (err) {
            console.error('Registration failed:', err);
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
                toast.error('Registration failed. Please check the form for errors.');
            } else {
                const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred during registration.';
                setErrors({ general: [errorMessage] });
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Create Admin Account</h1>
                <p className="text-center text-slate-500 mb-8">Join the GameXpress dashboard</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="name"
                            className={`block w-full px-4 py-2 text-slate-900 border ${errors.name ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-brand-500 focus:border-brand-500'} sm:text-sm transition duration-150 ease-in-out`}
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            className={`block w-full px-4 py-2 text-slate-900 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-brand-500 focus:border-brand-500'} sm:text-sm transition duration-150 ease-in-out`}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                         {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            className={`block w-full px-4 py-2 text-slate-900 border ${errors.password ? 'border-red-500' : 'border-slate-300'} rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-brand-500 focus:border-brand-500'} sm:text-sm transition duration-150 ease-in-out`}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                         {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password_confirmation">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            autoComplete="new-password"
                            className="block w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="••••••••"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                        />
                    </div>

                    {errors.general && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{errors.general[0]}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Registering...' : 'Create Account'}
                    </button>
                     <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
