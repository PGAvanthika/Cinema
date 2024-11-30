import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
  return (
    <div className="w-full bg-gray-50 p-6 text-gray-800">
      <div className="max-w-screen-xl mx-auto flex flex-col rounded-md shadow-lg">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Now Showing</h2>
        {isFetchingMoviesDone ? (
          movies.length ? (
            <div className="mt-1 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {movies.map((movie, index) => {
                const isSelected = movies[selectedMovieIndex]?._id === movie._id;
                return (
                  <div
                    key={index}
                    title={movie.name}
                    className={`flex flex-col items-center bg-white border border-gray-300 rounded-lg shadow-md transition duration-200 ease-in-out ${
                      isSelected ? 'bg-gradient-to-b from-red-600 to-red-700 text-white shadow-2xl' : 'hover:shadow-lg'
                    }`} // Highlighted style for selected card
                    onClick={() => {
                      isSelected ? setSelectedMovieIndex(null) : setSelectedMovieIndex(index);
                      sessionStorage.setItem('selectedMovieIndex', isSelected ? null : index);
                    }}
                  >
                    <img
                      src={movie.img}
                      alt={movie.name}
                      className="h-64 w-full rounded-t-lg object-cover" // Fixed image height
                    />
                    <p className="truncate pt-2 text-center text-lg font-semibold leading-5">
                      {movie.name}
                    </p>
                    <button className="mt-2 mb-2 rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition-colors duration-300">
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-center text-red-700">There are no movies available</p>
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default NowShowing;
