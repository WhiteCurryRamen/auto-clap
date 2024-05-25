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

		const message = body.message;
		const messageType = fetchMessageType(message);

		console.log(messageType);

		// auto slap
		if (messageType.message_type == 'sticker') {
			const messageMetadata = messageType.metadata;
			const messageTarget = messageType.target;
			const setName = messageMetadata.set_name;
			const emoji = messageMetadata.emoji;
			if (setName == 'Suicas' && emoji == '👋') {
				// await bot.sendMessage(messageTarget.chat_id, messageTarget.user_id);
				await bot.sendSticker(messageTarget.chat_id, 'CAACAgUAAxkBAAErWjZmQGJ2b_h7Fw90Kl5ZlctqHj1kqAACPgADvXbGBZkkgZg6z6UTNQQ');
			}
		}

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
	const targetChat = messageObj.chat.id;

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
				target_chat: targetChat,
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
			target_chat: targetChat,
		};
	}

	// text
	return {
		message_type: 'text',
		metadata: {
			content: messageObj.text,
		},
		target_chat: targetChat,
	};
};
