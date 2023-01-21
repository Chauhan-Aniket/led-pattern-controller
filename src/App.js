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
		if (!ws || ws.readyState === WebSocket.CLOSED) {
			console.log("Connecting to WS");
			const webSocket = new WebSocket(`ws://192.168.0.223:443/ws`);
			setWs(webSocket);
		}

		if (ws) {
			ws.onopen = () => console.log("Connected to WebSocket");

			ws.onmessage = (e) => {
				console.log(e.data);
				const receivedJson = JSON.parse(e.data);
				if (
					Object.keys(receivedJson)[0] === "leds" &&
					Object.keys(receivedJson)[1] === "patterns"
				) {
					setLedNum(receivedJson.leds);

					const receivedValues = Object.values(receivedJson.patterns).map(
						(value) => value.slice(1, 3)
					);
					setValues(receivedValues);

					const receivedSwitchValues = Object.values(receivedJson.patterns).map(
						(value) => (value[0] === 0 ? false : true)
					);
					setSwitchValues(receivedSwitchValues);
				}
			};

			ws.onclose = () => {
				console.log("WebSocket is closed");
				const webSocket = new WebSocket(`ws://192.168.0.223:443/ws`);
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
				<div className="max-[464px]:w-full flex items-center max-[464px]:flex-col">
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
					className="relative max-[464px]:fixed max-[464px]:bottom-3 max-[464px]:right-4 p-2 bg-blue-500 text-gray-50 rounded z-[1]"
					onClick={handleButtonClick}
					title="Send"
				>
					<svg
						width="24"
						height="24"
						fill="#ffffff"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M21.243 12.437a.5.5 0 0 0 0-.874l-2.282-1.268A75.497 75.497 0 0 0 4.813 4.231l-.665-.208A.5.5 0 0 0 3.5 4.5v5.75a.5.5 0 0 0 .474.5l1.01.053a44.41 44.41 0 0 1 7.314.998l.238.053c.053.011.076.033.089.05a.163.163 0 0 1 .029.096c0 .04-.013.074-.029.096-.013.017-.036.039-.089.05l-.238.053a44.509 44.509 0 0 1-7.315.999l-1.01.053a.5.5 0 0 0-.473.499v5.75a.5.5 0 0 0 .65.477l.664-.208a75.499 75.499 0 0 0 14.146-6.064l2.283-1.268Z"></path>
					</svg>
				</button>
			</section>
			<section className="min-h-full grid min-[374px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-12 grid-flow-row gap-5 bg-gray-900 max-[464px]:mb-14">
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
