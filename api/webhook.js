const TelegramBot = require('node-telegram-bot-api');
const ngrok = require('ngrok');

module.exports = async (request, response) => {
	try {
		// if (process.env.NODE_ENV == 'development') {
		// 	const url = await ngrok.connect({
		// 		subdomain: 'handOwt',
		// 	});
		// }
		const bot = new TelegramBot(process.env.TG_BOT_TOKEN);
		// const { body } = request;

		// if (body.message) {
		// 	const { chat, from, text } = body.message;

		// 	const chatId = chat.id;
		// 	const userId = from.username;

		// 	console.log('running inside');
		// 	console.log(body.message);

		// 	await bot.sendMessage(chatId, userId);
		// 	await bot.sendSticker(chat.id, 'CAACAgUAAxkBAAErWjZmQGJ2b_h7Fw90Kl5ZlctqHj1kqAACPgADvXbGBZkkgZg6z6UTNQQ');
		// }

		bot.on('message', async (msg) => {
			console.log('received', msg);
		});

		bot.on('text', async (msg) => {
			console.log('text_received', msg.chat.title);
		});

		// bot.on('message', (msg) => {
		// 	const chatId = msg.chat.id;
		// 	const userId = msg.from.username;

		// 	console.log('running inside');
		// 	console.log('chatId: ', chatId);
		// 	console.log('userId: ', userId);

		// 	bot.sendMessage(chatId, userId);
		// });

		// await bot.sendMessage(id, message, { parse_mode: 'Markdown' });
	} catch (error) {
		console.error('Error sending message');
		console.log(error.toString());
	}
	response.send('OK');
};
