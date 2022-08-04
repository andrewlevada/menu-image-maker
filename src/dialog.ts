import { Telegraf } from "telegraf";

export default function (bot: Telegraf) {
	bot.on("text", ctx => ctx.reply("Test"))
}
