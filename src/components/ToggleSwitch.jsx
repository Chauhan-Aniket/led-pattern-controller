import React from "react";

const ToggleSwitch = ({ checked, onChange }) => {
	const handleChange = (e) => {
		onChange(e.target.checked);
	};

	return (
		<label className="relative inline-flex items-center">
			<input
				type="checkbox"
				className="sr-only peer"
				checked={checked}
				onChange={handleChange}
			/>
			<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
		</label>
	);
};

export default ToggleSwitch;
