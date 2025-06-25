import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { emailAtom, isHostAtom, isLoggedInAtom, nameAtom, passwordAtom, roleAtom } from '../store/atoms/Auth';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const RegisterForm = () => {
    const navigate = useNavigate();

    const setIsLoggedIn = useSetRecoilState(isLoggedInAtom);

    const setisHost = useSetRecoilState(isHostAtom);
    const [name, setName] = useRecoilState(nameAtom);
    const [email, setEmail] = useRecoilState(emailAtom);
    const [password, setPassword] = useRecoilState(passwordAtom);
    const [role, setRole] = useRecoilState(roleAtom);




    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create an account</h2>
                <p className="text-gray-600">Join StayFinder as a guest or host</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"

                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                    <input
                        type="email"
                        name="email"

                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            placeholder="Create a password"
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Choose your role</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['guest', 'host'].map((option) => {
                            const isSelected = role === option;
                            return (
                                <div
                                    key={option}
                                    onClick={() => { setRole(option) }}
                                    className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center text-center transition-all ${isSelected
                                        ? 'border-rose-500 bg-rose-50 shadow-md'
                                        : 'border-gray-300 hover:border-rose-400'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">
                                        {option === 'guest' ? '🧳' : '🏠'}
                                    </div>
                                    <div className="font-semibold capitalize">{option}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {option === 'guest'
                                            ? 'Book a stay with ease'
                                            : 'List your property and earn'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


                <button
                    disabled={isLoading}
                    onClick={async () => {
                        const response = await axios.post(`${backendUrl}/users/register`, {
                            name: name,
                            email: email,
                            password: password,
                            role: role
                        });

                        if (response.data.isauthorized) {
                            localStorage.setItem("token", response.data.token);
                            setisHost(response.data.isHost);
                            setIsLoggedIn(true);
                            navigate('/profile');


                        } else {
                            alert('Somthing is up try later')
                        }




                    }}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 px-4 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Creating account...
                        </div>
                    ) : (
                        'Register'
                    )}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>

                    <button
                        type="button"
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                    </button>
                </div>

                <div className="text-center pt-6 border-t border-gray-200">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-rose-600 hover:text-rose-500 font-medium" onClick={() => {
                            navigate('/login')
                        }}>
                            Log In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
