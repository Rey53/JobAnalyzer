
import React, { useState } from 'react';
import { Lock, User, AlertCircle } from 'lucide-react';

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Credentials stored with basic obfuscation (btoa = base64 encoding)
    const VALID_USERNAME = atob('UGhhcm1h'); // 'Pharma'
    const VALID_PASSWORD = atob('UGhhcm1hMjAyNg=='); // 'Pharma2026'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for better UX
        setTimeout(() => {
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                // Create a session token
                const sessionToken = btoa(`${username}:${Date.now()}`);
                sessionStorage.setItem('pharma_auth_token', sessionToken);
                sessionStorage.setItem('pharma_auth_user', username);
                sessionStorage.setItem('pharma_auth_timestamp', Date.now().toString());
                
                onLoginSuccess();
            } else {
                setError('Invalid username or password');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            
            {/* Horizontal Watermark */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden pointer-events-none pt-8">
                <div 
                    className="text-white font-black text-8xl whitespace-nowrap select-none"
                    style={{
                        opacity: 0.18,
                        letterSpacing: '0.5rem',
                        textShadow: '2px 2px 8px rgba(0,0,0,0.2)'
                    }}
                >
                    ServicioXpert
                </div>
            </div>
            
            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white p-4 rounded-full shadow-2xl mb-4">
                        <Lock className="w-12 h-12 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">PharmaPace PR</h1>
                    <p className="text-blue-100 text-lg">Pharmaceutical Job Opportunity Analyzer</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Secure Access</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter username"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter password"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Powered by ServicioXpert.com
                        </p>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-4 text-center space-y-1">
                    <p className="text-xs text-blue-100">
                        🔒 Secure Access Required • Puerto Rico Pharmaceutical Sector
                    </p>
                    <p className="text-xs text-blue-200">
                        <a 
                            href="https://portfolio.servicioxpert.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-white hover:underline transition-all"
                        >
                            portfolio.servicioxpert.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
