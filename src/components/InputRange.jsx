import React, { useState } from "react";

const InputRange = ({ label, min, max, value, onChange }) => {
	const [rangeValue, setRangeValue] = useState(value);

	const handleChange = (e) => {
		setRangeValue(e.target.value);
		onChange(e.target.value);
	};

	return (
		<div className="input-box">
			<label
				htmlFor={`range${label}`}
				className="block py-2 text-sm font-medium"
			>
				{label}
			</label>
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
