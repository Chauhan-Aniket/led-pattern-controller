import { useEffect } from "react";

function ScrollingTitle() {
	useEffect(() => {
		let index = 0;
		let intervalId = 0;
		const originalTitle = document.title + " ";
		const titleArray = originalTitle.split("");
		intervalId = setInterval(() => {
			document.title = titleArray
				.slice(index, titleArray.length)
				.concat(titleArray.slice(0, index))
				.join("");
			index = (index + 1) % titleArray.length;
		}, 400);

		return () => {
			clearInterval(intervalId);
			document.title = originalTitle;
		};
	}, []);

	return null;
}

export default ScrollingTitle;
