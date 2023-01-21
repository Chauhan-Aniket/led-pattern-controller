import React, { useState } from "react";
import InputRange from "./InputRange";
import ToggleSwitch from "./ToggleSwitch";

const Accordion = ({
	patterns,
	values,
	onChange,
	switchState,
	handleSwitch,
	decrementPatternValue,
	incrementPatternValue,
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
						onClick={() => switchState[index] && toggleAccordion(index)}
					>
						<p className="p-4 font-medium text-sm">{pattern.heading}</p>
						<div className="flex items-center">
							<ToggleSwitch
								checked={switchState[index]}
								onChange={(value) => handleSwitch(index, value)}
							/>
							<svg
								width="35"
								height="35"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="1.5"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								className={`fill-gray-50 ${
									activeSections.includes(index) && "rotate-180"
								} ${!switchState[index] && "rotate-0"}`}
							>
								<path d="M16.571 9.714 12 14.286 7.429 9.714"></path>
							</svg>
						</div>
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
									decrementPatternValue={() =>
										decrementPatternValue(index, inputIndex)
									}
									incrementPatternValue={() =>
										incrementPatternValue(index, inputIndex)
									}
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
