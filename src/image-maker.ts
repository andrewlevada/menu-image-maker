import { generate } from "text-to-image";

async function generateImage(text: string): Promise<Buffer> {
	const dataUri = await generate(text.trim(), {
		fontPath: "assets/Cousine-Regular.ttf",
		lineHeight: 26,
		margin: 40,
		maxWidth: 800
	});

	return Buffer.from(dataUri.split(",")[1], "base64");
}

export default generateImage;
