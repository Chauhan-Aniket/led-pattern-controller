import React, { useState, useEffect } from "react";
import Accordion from "./components/Accordion";

import patterns from "./components/PatternParams";

function App() {
	const [values, setValues] = useState(
		patterns.map((pattern) => pattern.body.map((input) => input.value))
	);
	const [switchValues, setSwitchValues] = useState(patterns.map(() => false));
	const [ledNum, setLedNum] = useState(100);
	const [ws, setWs] = useState(null);
	const [timeoutId, setTimeoutId] = useState(null);

	useEffect(() => {
		if (!ws) {
			const webSocket = new WebSocket(`ws://192.168.1.223/ws`);
			setWs(webSocket);
		}

		if (ws) {
			ws.onclose = () => {
				const webSocket = new WebSocket(`ws://192.168.1.223/ws`);
				setTimeoutId(setTimeout(() => setWs(null), 5000));
				setWs(webSocket);
			};
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [ws]);

	const handleChange = (index, inputIndex, value) => {
		setValues(
			values.map((patternValues, i) =>
				i === index
					? patternValues.map((inputValue, j) =>
							j === inputIndex ? parseInt(value) : parseInt(inputValue)
					  )
					: patternValues
			)
		);
	};

	const handleSwitch = (patternIndex, value) => {
		setSwitchValues(
			switchValues.map((state, i) => (i === patternIndex ? value : state))
		);
	};

	const patternsObj = {};
	patterns.map(
		(val, i) =>
			(patternsObj[`p${i + 1}`] = [switchValues[i] ? 1 : 0, values[i]].flat())
	);

	const handleButtonClick = () => {
		if (ws) {
			ws.send(
				JSON.stringify({
					leds: parseInt(ledNum),
					patterns: patternsObj,
				})
			);
		}
	};

	ws &&
		(ws.onopen = () => {
			ws.send(
				JSON.stringify({
					leds: parseInt(ledNum),
					patterns: patternsObj,
				})
			);
			ws.onmessage = (e) => console.log(e.data);
		});
	ws && (ws.onmessage = (e) => console.log(e.data));

	return (
		<main className="min-h-screen p-4 bg-gray-900">
			<section className="mb-4 p-4 max-[404px]:flex-col flex items-center justify-between text-sm font-medium bg-gray-800 text-gray-50 border border-gray-700 rounded">
				<div className="max-[404px]:mb-4 max-[404px]:pb-6 max-[404px]:border-b border-gray-700 max-[404px]:w-full flex items-center max-[404px]:flex-col">
					<label
						htmlFor="ledNum"
						className="max-[404px]:w-full max-[404px]:mb-4"
					>
						Number of LEDs
					</label>
					<input
						type="range"
						name="ledNum"
						id="ledNum"
						min={1}
						max={1000}
						value={ledNum}
						onChange={(e) => setLedNum(e.target.value)}
						className="min-[404px]:ml-4 max-[404px]:w-full h-1 bg-gray-200 rounded-lg cursor-pointer range-sm"
					/>
				</div>
				<button
					className="max-[404px]:w-full px-4 py-2 bg-blue-500 text-gray-50 text-sm font-normal tracking-wide rounded"
					onClick={handleButtonClick}
				>
					Send
				</button>
			</section>
			<section className="min-h-full grid min-[374px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-12 grid-flow-row gap-5 bg-gray-900">
				<Accordion
					patterns={patterns}
					onChange={handleChange}
					values={values}
					switchState={switchValues}
					handleSwitch={handleSwitch}
				/>
			</section>
		</main>
	);
}

export default App;
