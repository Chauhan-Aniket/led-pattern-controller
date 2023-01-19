export class patternConfig {
	constructor(patternCount) {
		this.count = patternCount;
	}

	create() {
		const patterns = [];
		for (let i = 1; i <= this.count; i++) {
			patterns.push({
				heading: `Pattern ${i}`,
				body: [
					{
						label: "Brightness",
						min: 1,
						max: 255,
						value: 50,
					},
					{
						label: "Delay",
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
