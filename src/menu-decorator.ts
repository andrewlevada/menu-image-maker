const dotsExtractor = /(.+)\.\.(.+)/;
const dotsMarker = "&dots&";
const minDots = 3;

export function fixDottedAlignment(text: string): string {
	const lines = text.split("\n");
	const undotted = [];

	for (const line of lines) {
		const m = line.trim().match(dotsExtractor);

		if (m) undotted.push(m[1].replace(/\./g, "") + dotsMarker + m[2].replace(/\./g, ""));
		else undotted.push(line);
	}

	const width = Math.max(...undotted.map(v => v.length)) + minDots + 1;

	let aligned = "";

	for (const line of undotted) {
		const dotsCount = Math.max(width - line.length, minDots)
		const v = line.replace(dotsMarker, ".".repeat(dotsCount));
		aligned += `${v}\n`;
	}

	return aligned;
}
