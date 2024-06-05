const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const SPECIAL_CHARS = ['\\', '_', '*', '[', ']', '(', ')', '~', '`', '>', '<', '&', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
const escapeMarkdown = (text) => {
	SPECIAL_CHARS.forEach((char) => (text = text.replaceAll(char, `\\${char}`)));
	return text;
};

const asyncTimeout = (ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

async function getData(docID, sheetID) {
	const serviceAccountAuth = new JWT({
		email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		key: process.env.GOOGLE_PRIVATE_KEY,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});
	const doc = new GoogleSpreadsheet(docID, serviceAccountAuth);
	await doc.loadInfo();
	const sheet = doc.sheetsById[sheetID];
	const rows = await sheet.getRows();
	return rows;
}

module.exports = { asyncTimeout, getData, escapeMarkdown };
