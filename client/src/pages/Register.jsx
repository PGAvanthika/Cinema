import axios from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [errorsMessage, setErrorsMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsRegistering(true);
    try {
      const response = await axios.post('/auth/register', data);
      toast.success('Registration successful!', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false,
      });
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
      setIsRegistering(false);
    }
  };

  const inputClasses = (hasError) => {
    return `appearance-none rounded-md block w-full px-3 py-2 border ${
      hasError ? 'border-red-500' : 'border-gray-300'
    } placeholder-gray-500 text-gray-900 focus:outline-none focus:border-red-500 transition duration-300 ease-in-out`;
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      
    >
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-6 shadow-xl transform transition-transform duration-500 ease-in-out">
        <div className="fade-in" style={{ animation: 'fadeIn 0.5s forwards' }}>
          <h2 className="mt-4 text-center text-4xl font-extrabold text-red-600">
            Register
          </h2>
        </div>
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
            name="email"
            type="email"
            autoComplete="email"
            {...register('email', { required: true })}
            className={inputClasses(errors.email)}
            placeholder="Email"
          />
          {errors.email && (
            <span className="text-sm text-red-500">Email is required</span>
          )}

          <input
            name="password"
            type="password"
            autoComplete="current-password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            })}
            className={inputClasses(errors.password)}
            placeholder="Password"
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password?.message}
            </span>
          )}

          <div>
            {errorsMessage && (
              <span className="text-sm text-red-500">{errorsMessage}</span>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-gradient-to-br from-red-600 to-red-700 py-2 px-4 font-medium text-white drop-shadow-md hover:bg-red-800 transform transition-transform duration-200 ease-in-out hover:scale-105"
              disabled={isRegistering}
            >
              {isRegistering ? 'Processing...' : 'Register'}
            </button>
          </div>

          <p className="text-right">
            Already have an account?{' '}
            <Link
              to={'/login'}
              className="font-bold text-red-500 hover:text-red-400"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>

      {/* Add the following style tag for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .bg-white {
          background-color: white;
        }
        .border-gray-300 {
          border-color: #d1d5db;
        }
        .rounded-md {
          border-radius: 0.375rem;
        }
        .text-red-600 {
          color: #c53030;
        }
        .shadow-xl {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Register;
