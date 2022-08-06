import { generate } from "text-to-image";

async function generateImage(text: string): Promise<Buffer> {
	const width = (Math.max(...text.split("\n").map(v => v.length)) - 1) * 13;

	const dataUri = await generate(text.trim(), {
		fontPath: "build/Cousine-Regular.ttf",
		lineHeight: 26,
		margin: 40,
		maxWidth: width,
	});

	return Buffer.from(dataUri.split(",")[1], "base64");
}

export default generateImage;
