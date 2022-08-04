import { Bot } from "grammy";

export default function (bot: Bot) {
	bot.on("message", ctx => ctx.reply("Test"))
}
