import { Bot, InputFile } from "grammy";
import texts from "./texts";
import { ReplyKeyboardMarkup } from "@grammyjs/types/markup";
import { CustomContext } from "./app";
import generateImage from "./image-maker";
import { fixDottedAlignment } from "./menu-decorator";

const defaultKeyboard = {
	keyboard: [[texts.keys.convertMode]],
	resize_keyboard: true,
} as ReplyKeyboardMarkup;

export default function (bot: Bot<CustomContext>) {
	bot.command("start", ctx => ctx.reply(texts.res.start, {
		reply_markup: defaultKeyboard,
	}));

	bot.hears(texts.keys.convertMode, ctx => {
		ctx.session.location = "creation";
		ctx.reply(texts.res.creation.intro, {
			reply_markup: { remove_keyboard: true },
		}).then();
	});

	bot.on("message:text", async (ctx, next) => {
		if (ctx.session.location != "creation") {
			await next();
			return;
		}

		let text = ctx.message.text;
		if (!text) {
			await ctx.reply(texts.res.creation.error);
			ctx.session.location = "default";
			return;
		}

		text = fixDottedAlignment(text);

		const blob = await generateImage(text);
		await ctx.reply("Картинка готова!");
		await ctx.replyWithPhoto(new InputFile(blob), {
			reply_markup: defaultKeyboard,
		});

		ctx.session.location = "default";
	});


	// This should be the last middleware
	bot.on("message:text", ctx => ctx.reply(texts.res.unknown, {
		reply_markup: defaultKeyboard,
	}));
}
