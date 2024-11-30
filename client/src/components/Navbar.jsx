import {
  ClockIcon,
  FilmIcon,
  HomeModernIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  UsersIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await axios.get('/auth/logout');
      setAuth({ username: null, email: null, role: null, token: null });
      sessionStorage.clear();
      navigate('/');
      toast.success('Logout successful!', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      });
    } catch (error) {
      console.error(error);
      toast.error('Error', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const menuLists = () => {
    return (
      <>
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
          {['/cinema', '/ticket', '/movie', '/user'].map((path, index) => {
            const labels = ['Cinema', 'Ticket', 'Movie', 'User'];
            const icons = [
              <HomeModernIcon />,
              <ClockIcon />,
              <TicketIcon />,
              <VideoCameraIcon />,
              <MagnifyingGlassIcon />,
              <UsersIcon />
            ];

            if (path === '/ticket' && !auth.role) return null;
            if (path === '/movie' && auth.role !== 'admin') return null;

            return (
              <Link
                key={index}
                to={path}
                className={`flex items-center justify-center gap-2 rounded-md px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-red-700 transform hover:scale-105 ${
                  window.location.pathname === path
                    ? 'bg-red-600 shadow-lg'
                    : 'bg-red-500'
                }`}
              >
                {icons[index]}
                <span>{labels[index]}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0 lg:justify-end">
          {auth.username && (
            <p className="text-md text-red-500 font-semibold">Welcome, {auth.username}!</p>
          )}
          {auth.token ? (
            <button
              className={`rounded-lg bg-red-600 px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-red-700 disabled:bg-red-300 ${isLoggingOut ? 'animate-pulse' : ''}`}
              onClick={() => onLogout()}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Processing...' : 'Logout'}
            </button>
          ) : (
            <Link to={'/login'}>
              <button className="rounded-lg bg-red-600 px-4 py-2 text-white shadow-md transition-all duration-300 ease-in-out hover:bg-red-700">
                Login
              </button>
            </Link>
          )}
        </div>
      </>
    );
  };

  return (
    <nav className={`flex flex-col items-center justify-between gap-2 bg-white px-6 py-4 shadow-lg lg:flex-row lg:justify-between lg:px-8 transition-all duration-300 ease-in-out ${menuOpen ? 'bg-red-100' : ''}`}>
      <div className="flex w-full flex-row justify-between lg:w-auto">
        <button className="flex items-center gap-2" onClick={() => navigate('/')}>
          <FilmIcon className="h-8 w-8 text-red-600 transition-all duration-300 ease-in-out hover:scale-110" />
          <h1 className="text-2xl text-red-600 font-bold transition-all duration-300 ease-in-out hover:scale-105">Cinema</h1>
        </button>
        <button
          className="flex h-8 w-8 items-center justify-center rounded lg:hidden"
          onClick={toggleMenu}
        >
          <Bars3Icon className="h-6 w-6 text-red-600 transition-all duration-300 ease-in-out hover:scale-110" />
        </button>
      </div>
      <div className={`hidden lg:flex grow justify-between gap-4 ${menuOpen ? 'fade-in' : ''}`}>
        {menuLists()}
      </div>
      {menuOpen && (
        <div className={`flex w-full flex-col gap-4 lg:hidden ${menuOpen ? 'fade-in' : ''}`}>
          {menuLists()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
  