import React, { useState, useEffect } from "react";
import Accordion from "./components/Accordion";

import { patternConfig } from "./components/PatternParams";

function App() {
	const patterns = new patternConfig(20).create();

	const [values, setValues] = useState(
		patterns.map((pattern) => pattern.body.map((input) => input.value))
	);
	const [switchValues, setSwitchValues] = useState(patterns.map(() => false));
	const [ledNum, setLedNum] = useState(100);
	const [ws, setWs] = useState(null);
	const [timeoutId, setTimeoutId] = useState(null);

	useEffect(() => {
		if (!ws) {
			console.log("Connecting to WS");
			const webSocket = new WebSocket(`ws://192.168.29.223:443/ws`);
			setWs(webSocket);
		}

		if (ws) {
			ws.onopen = () => console.log("WebSocket is open");

			ws.onmessage = (e) => console.log(e.data);

			ws.onclose = () => {
				console.log("WebSocket is closed");
				const webSocket = new WebSocket(`ws://192.168.29.223:443/ws`);
				setTimeoutId(setTimeout(() => setWs(null), 5000));
				setWs(webSocket);
			};

			ws.onerror = () =>
				console.log("There is an Error to connect with WebSocket");
		}

		return () => {
			clearTimeout(timeoutId);
		};
	}, [ws, timeoutId]);

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

	return (
		<main className="min-h-screen p-4 bg-gray-900">
			<section className="mb-4 p-4 max-[464px]:flex-col flex items-center justify-between text-sm font-medium bg-gray-800 text-gray-50 border border-gray-700 rounded">
				<div className="max-[464px]:mb-4 max-[464px]:pb-6 max-[464px]:border-b border-gray-700 max-[464px]:w-full flex items-center max-[464px]:flex-col">
					<label
						htmlFor="ledNum"
						className="max-[464px]:w-full max-[464px]:mb-4"
					>
						Number of LEDs
					</label>
					<div className="max-[464px]:w-full flex items-center gap-4">
						<input
							type="range"
							name="ledNum"
							id="ledNum"
							min={1}
							max={1000}
							value={ledNum}
							onChange={(e) => setLedNum(e.target.value)}
							className="min-[464px]:ml-4 max-[464px]:w-full h-1 bg-gray-200 rounded-lg cursor-pointer range-sm"
						/>
						<p className="px-1 font-normal border border-gray-700 rounded">
							{ledNum}
						</p>
					</div>
				</div>
				<button
					className="max-[464px]:w-full px-4 py-2 bg-blue-500 text-gray-50 text-sm font-normal tracking-wide rounded"
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
