const path = require('path')
const electron = require('electron')
const fs = require('fs')
let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app;

module.exports = i18n;

function i18n() {
	var locale = app.getLocale();
	switch (locale.substr(0, 2)) {
		case "fr":
		case "pt":
		case "it":
		case "en":
		case "es":
		case "de":
			locale = locale.substr(0, 2);
			break;
		case "zh":
			if (locale == "zh-CN") {
				locale = "zh";
			}
			break;
		default:
			break;
	}
	if (fs.existsSync(path.join(__dirname, locale + '.js'))) {
		loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, locale + '.js'), 'utf8'));
	} else {
		loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'en.js'), 'utf8'));
	}
}

i18n.prototype.__ = function(phrase) {
	let translation = loadedLanguage[phrase]
	if (translation === undefined) {
		translation = phrase
	}
	return (translation);
}