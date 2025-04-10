import React, { useState } from 'react';
import api from '../lib/axios';
import axios from 'axios';

export default function Login() {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setUser(null);

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
            console.log('User data:', userResponse.data);
            setUser(userResponse.data);

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
        }
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
                 <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Login
                </button>
                 {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                 {user && (
                    <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        <h3 className="font-bold">Login Success! User:</h3>
                        <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(user, null, 2)}</pre>
                    </div>
                 )}
            </form>
        </div>
    );
}
