import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [errorsMessage, setErrorsMessage] = useState('');
  const [isLoggingIn, setLoggingIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoggingIn(true);
    try {
      const response = await axios.post('/auth/login', data);
      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false,
      });
      setAuth((prev) => ({ ...prev, token: response.data.token }));
      navigate('/');
    } catch (error) {
      console.error(error.response.data);
      setErrorsMessage(error.response.data);
      toast.error('Error', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      setLoggingIn(false);
    }
  };

  const inputClasses = (hasError) => {
    return `appearance-none rounded-md block w-full px-4 py-3 border ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } placeholder-gray-400 text-gray-900 focus:outline-none focus:border-red-600 transition duration-300 ease-in-out`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white shadow-xl p-8">
        <h2 className="text-center text-3xl font-extrabold text-red-600">
          Login
        </h2>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            name="username"
            type="text"
            autoComplete="username"
            {...register('username', { required: true })}
            className={inputClasses(errors.username)}
            placeholder="Username"
          />
          {errors.username && (
            <span className="text-sm text-red-500">Username is required</span>
          )}
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: true })}
            className={inputClasses(errors.password)}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-sm text-red-500">Password is required</span>
          )}

          <div>
            {errorsMessage && (
              <span className="text-sm text-red-500">{errorsMessage}</span>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-red-600 py-2 px-4 font-medium text-white transition duration-200 ease-in-out hover:bg-red-700 transform hover:scale-105"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Processing...' : 'Login'}
            </button>
          </div>
          <p className="text-right text-gray-600">
            Don’t have an account?{' '}
            <Link
              to={'/register'}
              className="font-bold text-red-600 hover:text-red-500"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
