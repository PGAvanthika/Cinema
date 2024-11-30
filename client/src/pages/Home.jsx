import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Slider from 'react-slick'; // Import the slider component
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from '../components/Navbar';
import NowShowing from '../components/NowShowing';
import TheaterListsByMovie from '../components/TheaterListsByMovie';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { auth } = useContext(AuthContext);
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(
    parseInt(sessionStorage.getItem('selectedMovieIndex'))
  );
  const [movies, setMovies] = useState([]);
  const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false);

  const fetchMovies = async () => {
    try {
      setIsFetchingMoviesDone(false);
      let response;
      if (auth.role === 'admin') {
        response = await axios.get('/movie/unreleased/showing', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
      } else {
        response = await axios.get('/movie/showing');
      }
      setMovies(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMoviesDone(true);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const props = {
    movies,
    selectedMovieIndex,
    setSelectedMovieIndex,
    auth,
    isFetchingMoviesDone,
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const sliderImages = [
    'https://assets-in.bmscdn.com/promotions/cms/creatives/1726036566435_playcardnewweb.jpg',
    'https://assets-in.bmscdn.com/promotions/cms/creatives/1729853996522_jlic1240x300.jpg',
    'https://assets-in.bmscdn.com/promotions/cms/creatives/1728042216114_webmuktaneww.jpg',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-red-700">
      <Navbar />

      {/* Image Slider */}
      <div className="slider-container w-full h-48 sm:h-80 overflow-hidden"> {/* Reduced height */}
        <Slider {...sliderSettings}>
          {sliderImages.map((image, index) => (
            <div key={index} className="w-full h-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Main Content */}
      <div className="fade-in mx-auto max-w-4xl w-full p-6 bg-white bg-opacity-90 rounded-xl shadow-2xl text-red-800 mt-8"> {/* Increased padding */}
        <NowShowing {...props} />
        {movies[selectedMovieIndex]?.name && (
          <div className="mt-8">
            <TheaterListsByMovie {...props} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-red-700 text-white w-full py-16 mt-auto text-center"> {/* Increased padding */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Cinema</h2> {/* Increased text size */}
          <p className="mb-4">The best place to book your favorite movies!</p>
          <p>&copy; {new Date().getFullYear()} Movie Booking App. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 1s ease-in-out forwards;
        }

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
      `}</style>
    </div>
  );
};

export default Home;
