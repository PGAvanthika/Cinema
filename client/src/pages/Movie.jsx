import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import MovieLists from '../components/MovieLists'
import Navbar from '../components/Navbar'
import { AuthContext } from '../context/AuthContext'

const Movie = () => {
	const { auth } = useContext(AuthContext)
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors }
	} = useForm()

	const [movies, setMovies] = useState([])
	const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false)
	const [isAddingMovie, SetIsAddingMovie] = useState(false)

	const fetchMovies = async () => {
		try {
			setIsFetchingMoviesDone(false)
			const response = await axios.get('/movie')
			reset()
			setMovies(response.data.data)
		} catch (error) {
			console.error(error)
		} finally {
			setIsFetchingMoviesDone(true)
		}
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	const onAddMovie = async (data) => {
		try {
			data.length = (parseInt(data.lengthHr) || 0) * 60 + (parseInt(data.lengthMin) || 0)
			SetIsAddingMovie(true)
			const response = await axios.post('/movie', data, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchMovies()
			toast.success('Add movie successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetIsAddingMovie(false)
		}
	}

	const handleDelete = (movie) => {
		const confirmed = window.confirm(
			`Do you want to delete movie ${movie.name}, including its showtimes and tickets?`
		)
		if (confirmed) {
			onDeleteMovie(movie._id)
		}
	}

	const onDeleteMovie = async (id) => {
		try {
			const response = await axios.delete(`/movie/${id}`, {
				headers: {
					Authorization: `Bearer ${auth.token}`
				}
			})
			fetchMovies()
			toast.success('Delete movie successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} catch (error) {
			console.error(error)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		}
	}

	const inputHr = parseInt(watch('lengthHr')) || 0
	const inputMin = parseInt(watch('lengthMin')) || 0
	const sumMin = inputHr * 60 + inputMin
	const hr = Math.floor(sumMin / 60)
	const min = sumMin % 60

	return (
		<div className="flex flex-col min-h-screen bg-gray-100">
			<Navbar />
			<div className="container mx-auto p-6">
				<h2 className="text-4xl font-bold text-center text-red-600 mb-6">Movie Lists</h2>
				<form
					onSubmit={handleSubmit(onAddMovie)}
					className="bg-white p-6 rounded-lg shadow-lg mb-6"
				>
					<h3 className="text-2xl font-semibold text-red-600 mb-4">Add New Movie</h3>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="block text-lg font-semibold text-gray-700">Name:</label>
							<input
								type="text"
								required
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
								{...register('name', { required: true })}
							/>
						</div>
						<div>
							<label className="block text-lg font-semibold text-gray-700">Poster URL:</label>
							<input
								type="text"
								required
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
								{...register('img', { required: true })}
							/>
						</div>
						<div>
							<label className="block text-lg font-semibold text-gray-700">Length (hr.):</label>
							<input
								type="number"
								min="0"
								max="20"
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
								{...register('lengthHr')}
							/>
						</div>
						<div>
							<label className="block text-lg font-semibold text-gray-700">Length (min.):</label>
							<input
								type="number"
								min="0"
								max="2000"
								required
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
								{...register('lengthMin', { required: true })}
							/>
						</div>
						<div className="col-span-2">
							<p className="text-red-600">{`${hr}h ${min}m / ${sumMin}m`}</p>
						</div>
					</div>
					<div className="mt-4">
						<button
							className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-500 transition duration-200"
							type="submit"
							disabled={isAddingMovie}
						>
							{isAddingMovie ? 'Processing...' : 'ADD Movie'}
						</button>
					</div>
				</form>

				<div className="relative mb-6">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3">
						<MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
					</div>
					<input
						type="search"
						className="block w-full border border-gray-300 rounded-lg p-2 pl-10 text-gray-900"
						placeholder="Search movie"
						{...register('search')}
					/>
				</div>

				{isFetchingMoviesDone ? (
					<MovieLists movies={movies} search={watch('search')} handleDelete={handleDelete} />
				) : (
					<Loading />
				)}
			</div>
		</div>
	)
}

export default Movie
