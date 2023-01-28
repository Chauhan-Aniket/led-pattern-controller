import React, { useState, useEffect, useRef } from "react";

function MarqueeText({ text, speed }) {
	const [offset, setOffset] = useState(0);
	const containerRef = useRef(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setOffset((offset) => offset - 1);
		}, speed);

		return () => clearInterval(intervalId);
	}, [speed]);

	useEffect(() => {
		if (offset < -containerRef.current.clientWidth) {
			setOffset(containerRef.current.clientWidth);
		}
	}, [offset, containerRef]);

	const styles = {
		container: {
			overflow: "hidden",
			whiteSpace: "nowrap",
			width: "100%",
		},
		text: {
			transform: `translateX(${offset}px)`,
			display: "inline-block",
		},
	};

	return (
		<div ref={containerRef} style={styles.container}>
			<span style={styles.text}>{text}</span>
		</div>
	);
}

export default MarqueeText;
