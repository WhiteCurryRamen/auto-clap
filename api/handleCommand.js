const { getData, escapeMarkdown } = require('./helper');

const handleCommand = async (bot, message) => {
	const metadataValue = message.metadata.value;
	const metadataParam = message.metadata.param ?? [];
	const targetChat = message.target_chat;

	if (metadataValue == 'trash') {
		const rows = await getData(process.env.GOOGLE_SHEET_ID, '0');
		const length = rows.length;
		let choose = Math.floor(Math.random() * length);
		let randomString = escapeMarkdown(rows[choose].get('trashList'));
		const sent = await bot.sendMessage(targetChat, `||${randomString}||`, { parse_mode: 'MarkdownV2', disable_notification: true });
	}
};

module.exports = handleCommand;
