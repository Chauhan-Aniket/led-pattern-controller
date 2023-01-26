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
	reset,
	handlePlayClick,
	playingIndex,
	handleButtonClick,
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
					} ${playingIndex !== -1 && "opacity-50 pointer-events-none"} ${
						index === playingIndex && "opacity-100 pointer-events-auto"
					}`}
				>
					<div className="flex items-center">
						{index !== playingIndex ? (
							<button
								className="p-3 bg-blue-600 rounded-l"
								onClick={() => handlePlayClick(index)}
							>
								<svg
									width="24"
									height="24"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									viewBox="0 0 22 24"
									xmlns="http://www.w3.org/2000/svg"
									className="fill-gray-50"
								>
									<path d="m5 3 14 9-14 9V3z"></path>
								</svg>
							</button>
						) : (
							<button
								className="p-3 bg-blue-600 rounded-l"
								onClick={() => handleButtonClick()}
							>
								<svg
									width="24"
									height="24"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									viewBox="0 0 22 24"
									xmlns="http://www.w3.org/2000/svg"
									className="fill-gray-50"
								>
									<path d="M6 4h4v16H6z"></path>
									<path d="M14 4h4v16h-4z"></path>
								</svg>
							</button>
						)}
						<button
							className="relative w-full flex justify-between items-center"
							onClick={() => switchState[index] && toggleAccordion(index)}
						>
							<p className="p-3 font-medium text-sm">{pattern.heading}</p>
							<div className="flex items-center">
								<ToggleSwitch
									checked={playingIndex && switchState[index]}
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
					</div>
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
									reset={reset}
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
