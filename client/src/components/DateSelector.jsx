import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const DateSelector = ({ selectedDate, setSelectedDate }) => {
	const { auth } = useContext(AuthContext);
	const wrapperRef = useRef(null);
	const [isEditing, setIsEditing] = useState(false);

	const handlePrevDay = () => {
		const prevDay = new Date(selectedDate);
		prevDay.setDate(prevDay.getDate() - 1);
		setSelectedDate(prevDay);
		sessionStorage.setItem('selectedDate', prevDay);
	};

	const handleNextDay = () => {
		const nextDay = new Date(selectedDate);
		nextDay.setDate(nextDay.getDate() + 1);
		setSelectedDate(nextDay);
		sessionStorage.setItem('selectedDate', nextDay);
	};

	const handleToday = () => {
		const today = new Date();
		setSelectedDate(today);
		sessionStorage.setItem('selectedDate', today);
	};

	const formatDate = (date) => {
		const weekday = date.toLocaleString('default', { weekday: 'long' });
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'long' });
		const year = date.getFullYear();
		return `${weekday} ${day} ${month} ${year}`;
	};

	const DateShort = ({ date, selectedDate }) => {
		const day = date.getDate();
		const weekday = date.toLocaleString('default', { weekday: 'short' });

		const isThisDate =
			selectedDate.getDate() === date.getDate() &&
			selectedDate.getMonth() === date.getMonth() &&
			selectedDate.getFullYear() === date.getFullYear();

		const isToday = new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);

		return (
			<button
				title={formatDate(date)}
				className={`flex min-w-[48px] flex-col items-center justify-center rounded-lg p-2 font-semibold transition-colors duration-300 ${
					isThisDate
						? 'bg-red-700 text-white'
						: isToday
						? 'bg-red-500 text-white ring-2 ring-red-700 hover:bg-red-600'
						: isPast(date)
						? 'bg-gray-400 text-white cursor-not-allowed'
						: 'bg-red-200 hover:bg-red-300'
				}`}
				onClick={() => {
					if (!isPast(date)) {
						setSelectedDate(date);
						sessionStorage.setItem('selectedDate', date);
					}
				}}
				disabled={isPast(date)}
			>
				<p className="text-sm">{weekday}</p>
				<p className="text-xl">{day}</p>
			</button>
		);
	};

	const isPast = (date) => {
		return new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
	};

	const handleChange = (event) => {
		setSelectedDate(new Date(event.target.value));
	};

	function generateDateRange(startDate, endDate) {
		const dates = [];
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			dates.push(new Date(currentDate.getTime()));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	function getPastAndNextDateRange() {
		const today = new Date();
		const pastDays = new Date(today);
		if (auth.role === 'admin') {
			pastDays.setDate(today.getDate() - 7);
		}

		const nextDays = new Date(today);
		nextDays.setDate(today.getDate() + 14);

		return generateDateRange(pastDays, nextDays);
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, false);
		return () => {
			document.removeEventListener('click', handleClickOutside, false);
		};
	}, []);

	const handleClickOutside = (event) => {
		if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
			setIsEditing(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-lg">
			<div className="relative flex items-center justify-between gap-4 rounded-lg bg-red-600 p-4 text-white">
				{auth.role === 'admin' || !isPast(new Date().setDate(selectedDate.getDate() - 1)) ? (
					<button
						title="Go to yesterday"
						className="rounded-lg p-2 hover:bg-red-500 transition duration-300"
						onClick={handlePrevDay}
					>
						<ChevronLeftIcon className="h-8 w-8" />
					</button>
				) : (
					<div className="h-8 w-8"></div>
				)}

				{isEditing ? (
					<div className="w-full" ref={wrapperRef}>
						<input
							title="Select date"
							type="date"
							min={auth.role !== 'admin' && new Date().toLocaleDateString('en-CA')}
							required
							autoFocus
							className="w-full rounded-lg border border-red-700 bg-red-100 p-2 text-center text-2xl font-semibold text-red-700"
							value={selectedDate.toLocaleDateString('en-CA')}
							onChange={handleChange}
						/>
					</div>
				) : (
					<div
						className="flex-1 text-center text-xl cursor-pointer hover:bg-red-500 transition duration-300 rounded-lg p-2"
						onClick={() => {
							setIsEditing(true);
						}}
					>
						{formatDate(selectedDate)}
					</div>
				)}

				<div className="flex items-center justify-between gap-4">
					<button
						title="Go to tomorrow"
						className="rounded-lg p-2 hover:bg-red-500 transition duration-300"
						onClick={handleNextDay}
					>
						<ChevronRightIcon className="h-8 w-8" />
					</button>
					<button
						title="Go to today"
						className="rounded-lg p-2 hover:bg-red-500 transition duration-300"
						onClick={handleToday}
					>
						<ArrowPathIcon className="h-8 w-8" />
					</button>
				</div>
			</div>
			<div className="flex gap-2 overflow-auto">
				{getPastAndNextDateRange().map((date, index) => (
					<DateShort key={index} date={date} selectedDate={selectedDate} />
				))}
			</div>
		</div>
	);
};

export default DateSelector;
