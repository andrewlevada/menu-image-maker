import bindDialog from "./dialog";
import { Telegraf } from "telegraf";
import telegrafThrottler from "telegraf-throttler";
import Bottleneck from "bottleneck";
import { isProduction, productionUrl } from "./env";
import { CallbackQuery, Message } from "typegram";
import TextMessage = Message.TextMessage;

console.time("Initialization");

process.env.TZ = "Europe/Moscow";
startBot().then();

function startBot(): Promise<Telegraf> {
	console.time("Starting bot");
	const bot = new Telegraf(process.env.TELEGRAM_API_KEY as string);

	bot.use(telegrafThrottler({
		in: {
			highWater: 1,
			maxConcurrent: 1,
			minTime: 1200,
			strategy: Bottleneck.strategy.OVERFLOW,
		},
		out: {
			minTime: 20,
			reservoir: 200,
			reservoirRefreshAmount: 100,
			reservoirRefreshInterval: 2000,
		},
		inThrottlerError: ctx => {
			console.log(`Message from ${(ctx.from || ctx.chat)?.id} dropped by throttler.`);
			return Promise.resolve();
		},
	}));

	bindLogging(bot);
	bindDialog(bot);

	console.timeEnd("Starting bot");

	return bot.launch(isProduction() ? {
		webhook: {
			hookPath: bot.secretPathComponent(),
			port: +(process.env.PORT || "8000"),
		}
	} : {})
		.then(() => {
			console.timeEnd("Initialization");
			console.log("Started bot!");
		})
		.then(() => bot);
}

function bindLogging(bot: Telegraf): void {
	bot.use((ctx, next) => {
		if (!ctx.from) {
			console.log(`Update without .from - ignoring (${JSON.stringify(ctx?.chat)})`);
			return;
		}

		const userId = ctx.from.id.toString();

		if (ctx.message) console.log(`message from ${userId}: ${(ctx.message as TextMessage).text}`);
		else if (ctx.callbackQuery) console.log(`query from ${userId}: ${(ctx.callbackQuery as CallbackQuery).data}`);
		else console.log(`use from ${userId}`);

		next().then();
	});
}
