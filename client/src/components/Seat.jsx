import { CheckIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';

const Seat = ({ seat, setSelectedSeats, selectable, isAvailable }) => {
	const [isSelected, setIsSelected] = useState(false);

	return !isAvailable ? (
		<button
			title={`${seat.row}${seat.number}`}
			className="flex h-12 w-12 cursor-not-allowed items-center justify-center" // Increased size
		>
			<div className="h-10 w-10 rounded bg-red-500 drop-shadow-md"></div> {/* Increased size */}
		</button>
	) : isSelected ? (
		<button
			title={`${seat.row}${seat.number}`}
			className="flex h-12 w-12 items-center justify-center" // Increased size
			onClick={() => {
				setIsSelected(false);
				setSelectedSeats((prev) => prev.filter((e) => e !== `${seat.row}${seat.number}`));
			}}
		>
			<div className="flex h-10 w-10 items-center justify-center rounded bg-red-500 drop-shadow-md"> {/* Increased size */}
				<CheckIcon className="h-6 w-6 stroke-[3] text-white" /> {/* Adjusted icon size if needed */}
			</div>
		</button>
	) : (
		<button
			title={`${seat.row}${seat.number}`}
			className={`flex h-12 w-12 items-center justify-center ${!selectable && 'cursor-not-allowed'}`} // Increased size
			onClick={() => {
				if (selectable) {
					setIsSelected(true);
					setSelectedSeats((prev) => [...prev, `${seat.row}${seat.number}`]);
				}
			}}
		>
			<div className="h-10 w-10 rounded bg-white border-2 border-red-500 drop-shadow-md"></div> {/* Increased size */}
		</button>
	);
};

export default memo(Seat);
