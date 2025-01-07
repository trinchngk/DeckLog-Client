import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from "react-redux";
import { loginStart, loginFailure, loginSuccess } from '../redux/userSlice';
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, { username, email, password }, { withCredentials: true });
      console.log('Signup successful:', response.data);
      navigate('/login');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, { 
        name: result.user.displayName,
        email: result.user.email,
        img: result.user.photoURL,
      }, { withCredentials: true }); // Add withCredentials if needed
      
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (error) {
      console.error("Google sign-in error:", error);
      dispatch(loginFailure());
      setError('Failed to sign in with Google. Please try again.');
    }
  };


  return (
    <div className="font-mono flex flex-col items-center justify-center h-screen bg-[#3B3B3B]">
      <div className="w-full max-w-sm bg-[#2E2E33] shadow-md rounded-md p-6">
        <h1 className="text-2xl font-semibold text-center text-white mb-6">Signup</h1>
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-white">
              Username
            </label>
            <input
              type="username"
              id="username"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-1 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-900 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Signup
          </button>
        </form>
        <div className="mt-4 flex justify-center">
          <button className="text-center bg-white text-[#2E2E33] px-3 py-2 rounded hover:bg-gray-700 hover:text-white focus:outline-none focus:ring focus:ring-blue-300 flex" 
            onClick={signInWithGoogle}>
              <FcGoogle className='mt-1 mr-2'/>            
              Login with Google

          </button>          
        </div>
        <div className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;