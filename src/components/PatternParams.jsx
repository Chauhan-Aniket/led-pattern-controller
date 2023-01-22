export class patternConfig {
	constructor(patternCount) {
		this.count = patternCount;
	}

	create() {
		const patterns = [];
		for (let i = 1; i <= this.count; i++) {
			patterns.push({
				heading: `Effect ${i}`,
				body: [
					{
						label: "Brightness",
						min: 1,
						max: 255,
						value: 50,
					},
					{
						label: "Speed",
						min: 1,
						max: 100,
						value: 50,
					},
				],
			});
		}
		return patterns;
	}
}
