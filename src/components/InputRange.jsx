import React, { useState } from "react";

const InputRange = ({ label, min, max, value, onChange }) => {
	const [rangeValue, setRangeValue] = useState(value);

	const handleChange = (e) => {
		setRangeValue(e.target.value);
		onChange(e.target.value);
	};

	return (
		<div className="input-box">
			<div className="flex items-center justify-between">
				<label
					htmlFor={`range${label}`}
					className="block py-2 text-sm font-medium"
				>
					{label}
				</label>
				<p className="px-1 text-sm border border-gray-600 rounded">
					{rangeValue}
				</p>
			</div>
			<input
				type="range"
				name={`range${label}`}
				id={`range${label}`}
				min={min}
				max={max}
				value={rangeValue}
				onChange={handleChange}
				className="w-full h-1 mb-6 bg-gray-200 rounded-lg cursor-pointer range-sm"
			/>
		</div>
	);
};

export default InputRange;
