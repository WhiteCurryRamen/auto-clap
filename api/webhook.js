process.env.NTBA_FIX_319 = 'test';

const TelegramBot = require('node-telegram-bot-api');
const ngrok = require('ngrok');
const bot = new TelegramBot(process.env.TG_BOT_TOKEN);
const fetch = require('node-fetch');
const handleSticker = require('./handleSticker');
const handleCommand = require('./handleCommand');

module.exports = async (request, response) => {
	try {
		const { body } = request;
		const message = processMessage(body.message);
		const messageType = message.message_type;
		const metadataValue = message.metadata.value;
		const metadataParam = message.metadata.param ?? [];
		const targetChat = message.target_chat;

		if (messageType == 'sticker') {
			const sent = await handleSticker(bot, message);
		}

		if (messageType == 'command') {
			const sent = await handleCommand(bot, message);
		}

		if (messageType == 'text') {
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

const processMessage = (messageObj) => {
	const targetChat = messageObj.chat.id;

	// command
	if (!!messageObj.entities) {
		const firstEntity = messageObj.entities[0];
		if (firstEntity.type == 'bot_command') {
			const messageSplit = messageObj.text.split(' ');
			return {
				message_type: 'command',
				metadata: {
					value: messageSplit[0].replace('/', ''),
					param: messageSplit.length > 1 ? messageSplit.shift() : [],
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
				value: stickerObj.emoji,
				param: [stickerObj.set_name],
			},
			target_chat: targetChat,
		};
	}

	// text
	return {
		message_type: 'text',
		metadata: {
			value: messageObj.text,
		},
		target_chat: targetChat,
	};
};
