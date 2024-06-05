const { asyncTimeout } = require('./helper');

const handleSticker = async (bot, message) => {
	const metadataValue = message.metadata.value;
	const metadataParam = message.metadata.param ?? [];
	const targetChat = message.target_chat;

	if (metadataParam.includes('Suicas') && (metadataValue == '👋' || metadataValue == '🥊')) {
		let stickerUrl = '';
		if (metadataValue == '👋') {
			stickerUrl = 'CAACAgUAAxkBAAErWjZmQGJ2b_h7Fw90Kl5ZlctqHj1kqAACPgADvXbGBZkkgZg6z6UTNQQ';
		}
		if (metadataValue == '🥊') {
			stickerUrl = 'CAACAgUAAxkBAAErW6tmQMWstAXdilw4vUFIAU1-9bL2SAACSQADvXbGBW5aks8Pe2fzNQQ';
		}

		const sentSticker = await bot.sendSticker(targetChat, stickerUrl, {
			disable_notification: true,
		});
		const sentStickerChatId = sentSticker.chat.id;
		const sentStickerMessageId = sentSticker.message_id;
		await asyncTimeout(5000);
		const removeSticker = await bot.deleteMessage(sentStickerChatId, sentStickerMessageId);

		//10sec cd
		await asyncTimeout(10000);
	}
};

module.exports = handleSticker;
