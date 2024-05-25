process.env.NTBA_FIX_319 = 'test';

const TelegramBot = require('node-telegram-bot-api');
const ngrok = require('ngrok');
const bot = new TelegramBot(process.env.TG_BOT_TOKEN);

module.exports = async (request, response) => {
	try {
		// if (process.env.NODE_ENV == 'development') {
		// 	const url = await ngrok.connect({
		// 		subdomain: 'handOwt',
		// 	});
		// }

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

		const { body } = request;
		console.log(body.message);
		console.log('are u running?');
		console.log(async () => {
			await bot.getWebHookInfo();
		});
		console.log(async () => {
			await bot.getMe();
		});

		bot.on('message', async (msg) => {
			console.log('message');
			const chatId = msg.chat.id;
			await bot.sendMessage(chatId, 'from message');
		});

		bot.on('text', async (msg) => {
			console.log('text');
			const chatId = msg.chat.id;
			await bot.sendMessage(chatId, 'from text');
		});

		bot.on('polling_error', (error) => {
			console.log('polling_error:', error);
		});

		bot.on('polling', () => {
			console.log('polling...');
		});

		bot.on('webhook_error', (error) => {
			console.log('webhook_error:', error.code);
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
	response.end();
};

const fetchMessageType = (messageObj) => {
	// command
	if (!!messageObj.entities) {
		const firstEntity = messageObj.entities[0];
		if (firstEntity.type == 'bot_command') {
			const messageSplit = messageObj.text.split(' ');
			return {
				message_type: 'command',
				metadata: {
					command: messageSplit[0],
					content: messageSplit.shift().join(' '),
				},
			};
		}
	}

	// sticker
	if (!!messageObj.sticker) {
		const stickerObj = messageObj.sticker;
		return {
			message_type: 'sticker',
			metadata: {
				set_name: stickerObj.set_name,
				emoji: stickerObj.emoji,
			},
		};
	}

	// text
	return {
		message_type: 'text',
		metadata: {
			content: messageObj.text,
		},
	};
};
