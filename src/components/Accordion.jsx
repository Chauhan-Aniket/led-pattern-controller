import React, { useState } from "react";
import InputRange from "./InputRange";
import ToggleSwitch from "./ToggleSwitch";

const Accordion = ({
	patterns,
	values,
	onChange,
	switchState,
	handleSwitch,
}) => {
	const [activeSections, setActiveSections] = useState([]);

	const toggleAccordion = (index) => {
		if (activeSections.includes(index)) {
			setActiveSections(activeSections.filter((i) => i !== index));
		} else {
			setActiveSections([...activeSections, index]);
		}
	};

	return (
		<>
			{patterns.map((pattern, index) => (
				<div
					key={pattern.heading}
					className={`relative w-full h-fit text-gray-50 border border-gray-700 rounded ${
						switchState[index] && `bg-gray-700`
					}`}
				>
					<button
						className="relative w-full flex justify-between items-center"
						onClick={() => toggleAccordion(index)}
					>
						<p className="p-4 font-medium text-sm">{pattern.heading}</p>
						<ToggleSwitch
							checked={switchState[index]}
							onChange={(value) => handleSwitch(index, value)}
						/>
					</button>
					{switchState[index] && activeSections.includes(index) && (
						<div className="px-4 w-full border-t border-gray-600">
							{pattern.body.map((input, inputIndex) => (
								<InputRange
									key={input.label}
									label={input.label}
									min={input.min}
									max={input.max}
									value={values[index][inputIndex]}
									onChange={(value) => onChange(index, inputIndex, value)}
								/>
							))}
						</div>
					)}
				</div>
			))}
		</>
	);
};

export default Accordion;
