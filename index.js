const lisa = require("./src/index");
const { Bot } = require("grammy");

require("dotenv").config();

const bot = new Bot(process.env.TOKEN);

bot.start({
	onStart: () => {
		console.log("started");
	},
});

bot.on("message", (ctx) => {
	const text = ctx.message.text;

	if (text == "") return;

	if (text == "/start") {
		ctx.reply("salom");
	}

	const clasified = lisa.classify(text);
	console.log(`${clasified} "${text}"`);
});

const clasified = lisa.classify("salom");
console.log(clasified);
