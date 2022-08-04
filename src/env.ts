export const productionUrl = "https://menu-image-maker-bot.herokuapp.com";

export function isProduction() {
	return process.env.NODE_ENV === "production";
}
