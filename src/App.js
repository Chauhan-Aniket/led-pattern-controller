import React, { useState, useEffect } from "react";
import Accordion from "./components/Accordion";
import IconButton from "./components/IconButton";
import MarqueeText from "./components/MarqueeText";

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
	const [reset, setReset] = useState(false);
	const [patternsObj, setPatternsObj] = useState({});
	const [playingIndex, setPlayingIndex] = useState(-1);
	const [connectionState, setConnectionState] = useState("");
	const [connectionClass, setConnectionClass] = useState(
		"text-gray-50 border border-transparent"
	);

	useEffect(() => {
		const webSocket = new WebSocket(`ws://192.168.4.1:80/ws`);

		if (!ws || ws.readyState === WebSocket.CLOSED) {
			console.log("Connecting to WS");
			setConnectionState("Connecting to Device");
			setConnectionClass(
				"bg-[rgba(255,255,50,0.2)] border-[rgba(255,255,50,0.7)] text-[rgba(255,255,50,1)]"
			);
			setWs(webSocket);
		}

		if (ws) {
			ws.onopen = () => {
				console.log("Connected to WebSocket");
				setConnectionState("Connected");
				setConnectionClass(
					"bg-[rgba(50,255,50,0.2)] border-[rgba(50,255,50,0.7)] text-[rgba(50,255,50,1)]"
				);
			};

			ws.onmessage = (e) => {
				console.log(e.data);
				const receivedJson = JSON.parse(e.data);
				// console.log(receivedJson);
				if (
					Object.keys(receivedJson)[0] === "trial" &&
					Object.keys(receivedJson)[1] === "leds" &&
					Object.keys(receivedJson)[2] === "patterns"
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
				WebSocket.CLOSED && setConnectionState("Failed to connect Device");
				WebSocket.CLOSED &&
					setConnectionClass(
						"bg-[rgba(255,50,50,0.2)] border-[rgba(255,50,50,0.7)] text-[rgba(255,50,50,1)]"
					);
				setTimeoutId(setTimeout(() => setWs(null), 5000));
				setWs(webSocket);
			};

			ws.onerror = () => {
				setConnectionState("Failed to connect Device");
				setConnectionClass(
					"bg-[rgba(255,50,50,0.2)] border-[rgba(255,50,50,0.7)] text-[rgba(255,50,50,1)]"
				);
			};
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

	patterns.map(
		(val, i) =>
			(patternsObj[`p${i + 1}`] = [switchValues[i] ? 1 : 0, values[i]].flat())
	);

	const handleButtonClick = () => {
		if (ws) {
			ws.send(
				JSON.stringify({
					trial: 0,
					leds: parseInt(ledNum),
					patterns: patternsObj,
				})
			);
		}
	};

	const handlePlayClick = (index) => {
		const newPatterns = { ...patternsObj };
		Object.keys(newPatterns).forEach((key, i) => {
			newPatterns[key][0] = i === index ? 1 : 0;
		});
		setPatternsObj(newPatterns);
		// console.log(newPatterns);

		if (ws) {
			ws.onmessage = (e) => {
				const receivedJson = JSON.parse(e.data);
				// console.log(receivedJson);
				receivedJson.trial === 0 ? setPlayingIndex(-1) : setPlayingIndex(index);
			};
			ws.send(
				JSON.stringify({
					trial: 1,
					leds: parseInt(ledNum),
					patterns: patternsObj,
				})
			);
		}
	};

	const handleLedIncrement = () => {
		if (ledNum < 1000) {
			setLedNum(parseInt(ledNum) + 1);
		}
	};

	const handleLedDecrement = () => {
		if (ledNum > 10) {
			setLedNum(parseInt(ledNum) - 1);
		}
	};

	const incrementPatternValue = (index, inputIndex) => {
		setValues(
			values.map((patternValues, i) =>
				i === index
					? patternValues.map((inputValue, j) =>
							j === inputIndex ? inputValue + 1 : inputValue
					  )
					: patternValues
			)
		);
	};

	const decrementPatternValue = (index, inputIndex) => {
		setValues(
			values.map((patternValues, i) =>
				i === index
					? patternValues.map((inputValue, j) =>
							j === inputIndex ? inputValue - 1 : inputValue
					  )
					: patternValues
			)
		);
	};

	const handleReset = () => {
		setValues(
			patterns.map((pattern) => pattern.body.map((input) => input.value))
		);
		setSwitchValues(patterns.map(() => false));
		setLedNum(100);
		setReset(!reset);
	};

	return (
		<div className="h-screen flex flex-col bg-gray-900">
			<nav className="py-2 w-full grid place-items-center bg-blue-500 text-gray-50 text-center font-medium tracking-wider z-[9]">
				<MarqueeText text="TezTech WiFi Controller" speed={25} />
			</nav>
			<section className="m-4">
				<p
					className={`mb-4 p-2 border ${connectionClass} text-[0.7rem] tracking-widest text-center uppercase rounded`}
				>
					<span className="font-medium pr-2">Status:</span>
					<span>{connectionState}</span>
				</p>
				<div className="p-4 max-[464px]:flex-col flex items-center justify-between text-sm font-medium bg-gray-800 text-gray-50 border border-gray-700 rounded">
					<div className=" max-[464px]:w-full flex items-center flex-col">
						<div className="w-full mb-5 flex items-center justify-between">
							<label htmlFor="ledNum" className="max-[464px]:w-full">
								Number of LEDs
							</label>
							<p className="px-1 font-normal border border-gray-700 rounded">
								{ledNum}
							</p>
						</div>
						<div className="w-full flex items-center gap-4">
							<IconButton onClick={handleLedDecrement}>
								<svg
									width="20"
									height="20"
									fill="none"
									stroke="#ffffff"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M6.286 12h11.428"></path>
								</svg>
							</IconButton>
							<input
								type="range"
								name="ledNum"
								id="ledNum"
								min={10}
								max={1000}
								value={ledNum}
								onChange={(e) => setLedNum(e.target.value)}
								className="max-[464px]:w-full h-1 bg-gray-200 rounded-lg cursor-pointer range-sm"
							/>
							<IconButton onClick={handleLedIncrement}>
								<svg
									width="20"
									height="20"
									fill="none"
									stroke="#ffffff"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M6.286 12h11.428"></path>
									<path d="M12 6.286v11.428"></path>
								</svg>
							</IconButton>
						</div>
					</div>
				</div>
			</section>
			<section className="px-4 grid min-[374px]:grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-12 grid-flow-row gap-5 bg-gray-900 grow overflow-y-scroll">
				<Accordion
					patterns={patterns}
					onChange={handleChange}
					values={values}
					switchState={switchValues}
					handleSwitch={handleSwitch}
					decrementPatternValue={decrementPatternValue}
					incrementPatternValue={incrementPatternValue}
					reset={reset}
					handlePlayClick={handlePlayClick}
					playingIndex={playingIndex}
					handleButtonClick={handleButtonClick}
				/>
			</section>
			<section className="p-4 w-full flex items-center gap-2 font-medium">
				<button
					className="px-4 py-2 flex items-center justify-center bg-rose-500 text-gray-50 uppercase tracking-wide rounded"
					onClick={handleReset}
					title="Reset"
				>
					<span>Reset</span>
					<svg
						width="22"
						height="22"
						fill="none"
						stroke="#ffffff"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						viewBox="-4 -4 30 30"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M4.09 7.413A9.143 9.143 0 1 1 2.857 12"></path>
						<path d="M8.571 7.429H4V2.857"></path>
					</svg>
				</button>
				<button
					className="w-full px-4 py-2 flex items-center justify-center bg-blue-500 text-gray-50 uppercase tracking-wide rounded z-[1]"
					onClick={handleButtonClick}
					title="Send"
				>
					<span>Send</span>
					<svg
						width="24"
						height="24"
						fill="#ffffff"
						viewBox="0 0 18 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M21.243 12.437a.5.5 0 0 0 0-.874l-2.282-1.268A75.497 75.497 0 0 0 4.813 4.231l-.665-.208A.5.5 0 0 0 3.5 4.5v5.75a.5.5 0 0 0 .474.5l1.01.053a44.41 44.41 0 0 1 7.314.998l.238.053c.053.011.076.033.089.05a.163.163 0 0 1 .029.096c0 .04-.013.074-.029.096-.013.017-.036.039-.089.05l-.238.053a44.509 44.509 0 0 1-7.315.999l-1.01.053a.5.5 0 0 0-.473.499v5.75a.5.5 0 0 0 .65.477l.664-.208a75.499 75.499 0 0 0 14.146-6.064l2.283-1.268Z"></path>
					</svg>
				</button>
			</section>
		</div>
	);
}

export default App;
