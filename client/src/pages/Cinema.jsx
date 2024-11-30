import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import CinemaLists from '../components/CinemaLists';
import Navbar from '../components/Navbar';
import TheaterListsByCinema from '../components/TheaterListsByCinema';
import { AuthContext } from '../context/AuthContext';

const Cinema = () => {
  const { auth } = useContext(AuthContext);
  const [selectedCinemaIndex, setSelectedCinemaIndex] = useState(
    parseInt(sessionStorage.getItem('selectedCinemaIndex')) || 0
  );
  const [cinemas, setCinemas] = useState([]);
  const [isFetchingCinemas, setIsFetchingCinemas] = useState(true);

  const fetchCinemas = async (newSelectedCinema) => {
    try {
      setIsFetchingCinemas(true);
      let response;
      if (auth.role === 'admin') {
        response = await axios.get('/cinema/unreleased', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
      } else {
        response = await axios.get('/cinema');
      }

      setCinemas(response.data.data);
      if (newSelectedCinema) {
        response.data.data.forEach((cinema, index) => {
          if (cinema.name === newSelectedCinema) {
            setSelectedCinemaIndex(index);
            sessionStorage.setItem('selectedCinemaIndex', index);
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingCinemas(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const props = {
    cinemas,
    selectedCinemaIndex,
    setSelectedCinemaIndex,
    fetchCinemas,
    auth,
    isFetchingCinemas,
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-white pb-8 sm:gap-8 text-red-600">
      <Navbar />
      <div className="container mx-auto p-8 rounded-lg bg-white bg-opacity-90 shadow-lg">
        <h1 className="text-4xl font-bold text-center my-4 text-red-600 transition duration-300 hover:text-red-500">
          Cinemas
        </h1>
        <p className="text-center mb-6 text-lg text-red-700">
          Discover the latest movies and choose the perfect theater for your cinematic experience.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cinemas.map((cinema, index) => (
            <div
              key={index}
              className={`p-6 bg-white border border-red-600 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer`}
              onClick={() => {
                setSelectedCinemaIndex(index);
                sessionStorage.setItem('selectedCinemaIndex', index);
              }}
            >
              <h2 className="text-xl font-semibold mb-2 text-red-600">{cinema.name}</h2>
              <p className="text-sm text-gray-700">{cinema.description || 'See available movies'}</p>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      {cinemas[selectedCinemaIndex]?.name && <TheaterListsByCinema {...props} />}
    </div>
  );
};

export default Cinema;
