import bindDialog from "./dialog";
import { isProduction } from "./env";
import { Bot, Context, session, SessionFlavor, webhookCallback } from "grammy";
import express from "express";

export type UserLocation = "default" | "creation";
export interface SessionsData {
	location: UserLocation;
}

export type CustomContext = Context & SessionFlavor<SessionsData>

console.time("Initialization");

process.env.TZ = "Europe/Moscow";
startBot();
console.timeEnd("Initialization");
console.log("Started bot!");

function startBot(): Bot<CustomContext> {
	console.time("Starting bot");

	const bot = new Bot<CustomContext>(process.env.TELEGRAM_API_KEY as string);
	bot.use(session({ initial: () => ({ location: "default" } as SessionsData)}));

	bindLogging(bot);
	bindDialog(bot);

	console.timeEnd("Starting bot");

	if (isProduction()) {
		const app = express();
		app.use(express.json());
		app.use(webhookCallback(bot, "express"));
		app.listen(process.env.PORT || 443)
	} else bot.start().then();

	return bot;
}

function bindLogging(bot: Bot<CustomContext>): void {
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
