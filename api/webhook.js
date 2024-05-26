process.env.NTBA_FIX_319 = 'test';

const TelegramBot = require('node-telegram-bot-api');
const ngrok = require('ngrok');
const bot = new TelegramBot(process.env.TG_BOT_TOKEN);
const fetch = require('node-fetch');

module.exports = async (request, response) => {
	try {
		// if (process.env.NODE_ENV == 'development') {
		// 	fetch('http://localhost:4040/api/tunnels')
		// 		.then((res) => res.json())
		// 		.then((json) => json.tunnels.find((tunnel) => tunnel.proto === 'https'))
		// 		.then((secureTunnel) => {
		// 			console.log('?');
		// 			console.log(secureTunnel.public_url);
		// 		})
		// 		.catch((err) => {
		// 			if (err.code === 'ECONNREFUSED') {
		// 				return console.error("Looks like you're not running ngrok.");
		// 			}
		// 			console.error(err);
		// 		});
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

		const message = processMessage(body.message);

		console.log(messageType);
		const messageType = message.message_type;
		const metadataValue = message.metadata.value;
		const metadataParam = message.metadata.param ?? [];
		const targetChat = message.target_chat;

		// auto slap
		if (messageType == 'sticker') {
			if (metadataParam.includes('Suicas') && metadataValue == '👋') {
				await bot.sendSticker(targetChat, 'CAACAgUAAxkBAAErWjZmQGJ2b_h7Fw90Kl5ZlctqHj1kqAACPgADvXbGBZkkgZg6z6UTNQQ');
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
					value: messageSplit[0],
					param: messageSplit.shift(),
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
