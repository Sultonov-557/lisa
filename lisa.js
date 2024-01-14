const { NlpManager, Language } = require("node-nlp");
const { removeEmojis } = require("@nlpjs/emoji");
const axios = require("axios");

const data = require("./data.json");

class Lisa {
	constructor() {
		this.data = data;
		this.Language = new Language();
		this.manager = new NlpManager({
			languages: ["uz", "en"],
			nlu: { log: false, useNoneFeature: false, forceNER: true },
		});

		for (const lang in this.data) {
			for (const index in this.data[lang].words) {
				const { input, output } = this.data[lang].words[index];
				input.forEach((i) => this.manager.addDocument(lang, i, index));
				output.forEach((o) => this.manager.addAnswer(lang, index, o));
			}

			for (const index in this.data[lang].entity) {
				for (const entity in this.data[lang].entity[index]) {
					const text = this.data[lang].entity[index][entity];
					this.manager.addNamedEntityText(index, entity, ["uz"], text);
				}
			}
		}

		this.trainBot();
	}

	async trainBot() {
		await this.manager.train();
	}

	async ask(text) {
		text = removeEmojis(text);
		const res = await this.manager.process(this.Language.guess(text, ["uz", "en"])[0].alpha2, text);
		const entities = res.entities;
		let answer = await this.parseParams(res.answer, entities);

		const out = { text, answer, entities };
		return out;
	}

	/**
	 * @param {string} text
	 */
	async parseParams(text, entities) {
		try {
			if (text.includes("{{temprature}}")) {
				let location = "";

				for (let i of entities) {
					if (i.entity == "location") {
						location = i.option;
					}
				}

				const res = await axios.get(
					`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=e1a88097de590b5cc679f25d2191933f`
				);
				text = text.replaceAll("{{temprature}}", parseInt(res.data.main.temp));
			}

			return text;
		} catch {
			return text;
		}
	}
}

module.exports = { Lisa };
