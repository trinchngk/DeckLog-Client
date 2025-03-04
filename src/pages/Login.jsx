import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useDispatch } from "react-redux";
import { loginStart, loginFailure, loginSuccess } from '../redux/userSlice';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, 
        { email, password }, 
        { withCredentials: true,
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }});
      dispatch(loginSuccess(response.data));
      // console.log('Login successful:', response.data);
      // console.log('Login response headers:', response.headers);
      setTimeout(() => {
        window.location.href = '/';
      }, 100);

    } catch (err) {
      dispatch(loginFailure());
      console.error('Login error:', err);
      console.error('Login error details:', err.response);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, { username, email, password }, { withCredentials: true });
      enqueueSnackbar('Signup successful', { variant: 'success' });
      // console.log('Signup successful:', response.data);
      navigate('/login');

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
      }, 
      { withCredentials: true,
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }}); // Add withCredentials if needed
      
      dispatch(loginSuccess(response.data));
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error("Google sign-in error:", error);
      dispatch(loginFailure());
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="font-sans flex flex-row items-center justify-start h-screen bg-[#201c1c] gap-10 p-12">
      <div className="w-1/3 max-w-md bg-[#2E2E33] shadow-md rounded-lg border-2 border-blue-500 p-6 ml-12 py-10">
        <h1 className="text-2xl font-semibold text-center text-white mb-10">{isSignup ? 'Signup to MoveMonkey' : 'Login to MoveMonkey'}</h1>
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="my-2 bg-[#2E2E33] border-2 border-blue-500 px-4 py-2 w-full text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
          )}
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
              className="my-2 bg-[#2E2E33] border-2 border-blue-500 px-4 py-2 w-full text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
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
              className="my-2 bg-[#2E2E33] border-2 border-blue-500 px-4 py-2 w-full text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-1 w-full bg-blue-500 border-2 border-blue-500 text-white p-2 rounded-lg hover:bg-white hover:text-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {isSignup ? 'Signup' : 'Login'}
          </button>
        </form>
        <button className="mt-3 w-full justify-center text-center bg-white border-2 border-blue-500 text-[#2E2E33] px-3 py-2 rounded-lg hover:bg-[#2E2E33] hover:text-blue-500 focus:outline-none focus:ring focus:ring-blue-300 flex" 
          onClick={signInWithGoogle}>
            <FcGoogle className='mt-1 mr-2'/>            
            Login with Google
        </button>          
        <div className="mt-10 text-md text-center text-gray-500 flex  flex-col">
          {isSignup ? 'Already have an account? ' : 'Don\'t have an account? '}
          <button onClick={() => setIsSignup(!isSignup)} className="mt-3 w-full justify-center text-center bg-[#2E2E33] border-2 border-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-500 hover:text-[#2E2E33] focus:outline-none focus:ring focus:ring-blue-300 flex">
            {isSignup ? 'Login' : 'Sign up'}
          </button>
        </div>
      </div>
      <div className="w-2/3 m-6 max-w-sm shadow-md rounded-md p-6">
        <h1 className="text-blue-500 text-9xl font-mono font-semibold">
          MoveMonkey          
        </h1>
      </div>
    </div>    
  );
};

export default Login;