const keys = {
	convertMode: "Сделать картинку",
};

const res = {
	start: `Здравствуйте. Это бот конвертирует текст меню в картинку. Чтобы начать нажмите '${keys.convertMode}'`,
	creation: {
		intro: "Хорошо, отправте мне текст для превращения в картинку (одним сообщением)",
		error: "Не понимаю текст. Попробуйте снова или напишите @andrewlevada",
	},
};

const texts = { keys, res };
export default texts;
