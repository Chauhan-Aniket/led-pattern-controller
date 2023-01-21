import React from "react";

const IconButton = ({ children, onClick }) => {
	return (
		<button
			onMouseDown={onClick}
			className={`px-[1px] py-[1px] bg-blue-500 hover:bg-blue-600 text-gray-50 font-medium rounded`}
		>
			{children}
		</button>
	);
};

export default IconButton;
