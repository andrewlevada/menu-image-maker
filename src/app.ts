import bindDialog from "./dialog";
import { isProduction } from "./env";
import { Bot, webhookCallback } from "grammy";
import express from "express";

console.time("Initialization");

process.env.TZ = "Europe/Moscow";
startBot();
console.timeEnd("Initialization");
console.log("Started bot!");

function startBot(): Bot {
	console.time("Starting bot");
	const bot = new Bot(process.env.TELEGRAM_API_KEY as string);

	bindLogging(bot);
	bindDialog(bot);

	console.timeEnd("Starting bot");

	if (isProduction()) {
		const app = express();
		app.use(exports.json);
		app.use(webhookCallback(bot, "express"));
	} else bot.start().then();

	return bot;
}

function bindLogging(bot: Bot): void {
	bot.use((ctx, next) => {
		if (!ctx.from) {
			console.log(`Update without .from - ignoring (${JSON.stringify(ctx?.chat)})`);
			return;
		}

		const userId = ctx.from.id.toString();

		if (ctx.message) console.log(`message from ${userId}: ${ctx.message.text}`);
		else if (ctx.callbackQuery) console.log(`query from ${userId}: ${ctx.callbackQuery.data}`);
		else console.log(`use from ${userId}`);

		next().then();
	});
}
