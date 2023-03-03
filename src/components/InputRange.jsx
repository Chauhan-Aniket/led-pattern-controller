import React, { useState, useEffect } from "react";
import IconButton from "./IconButton";

const InputRange = ({
	label,
	min,
	max,
	value,
	onChange,
	decrementPatternValue,
	incrementPatternValue,
	reset,
}) => {
	const [rangeValue, setRangeValue] = useState(value);

	const handleChange = (e) => {
		setRangeValue(e.target.value);
		onChange(e.target.value);
	};

	const handleDecrement = () => {
		if (rangeValue > min) {
			setRangeValue(parseInt(rangeValue) - 1);
			decrementPatternValue(rangeValue);
		}
	};

	const handleIncrement = () => {
		if (rangeValue < max) {
			setRangeValue(parseInt(rangeValue) + 1);
			incrementPatternValue(rangeValue);
		}
	};

	useEffect(() => {
		setRangeValue(value);
	}, [value, reset]);

	return (
		<div className="input-box">
			<div className="my-1 flex items-center justify-between">
				<label
					htmlFor={`range${label}`}
					className="block py-2 text-sm font-medium uppercase tracking-wide"
				>
					{label}
				</label>
				<p className="px-1 text-sm border border-gray-600 rounded">
					{rangeValue}
				</p>
			</div>
			<div className="mb-4 flex items-center gap-4">
				<IconButton onClick={handleDecrement}>
					<svg
						width="23"
						height="23"
						fill="none"
						stroke="#ffffff"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M6.286 12h11.428"></path>
					</svg>
				</IconButton>
				<input
					type="range"
					name={`range${label}`}
					id={`range${label}`}
					min={min}
					max={max}
					value={rangeValue}
					onChange={handleChange}
					className="w-full h-1 bg-gray-200 rounded-lg cursor-pointer range-sm"
				/>
				<IconButton onClick={handleIncrement}>
					<svg
						width="23"
						height="23"
						fill="none"
						stroke="#ffffff"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M6.286 12h11.428"></path>
						<path d="M12 6.286v11.428"></path>
					</svg>
				</IconButton>
			</div>
		</div>
	);
};

export default InputRange;
