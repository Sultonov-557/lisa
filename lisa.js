const { NlpManager, Language } = require("node-nlp");
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

	async sendMessage(conversation) {
		const entities = [];
		let finalRes;
		for (let message of conversation) {
			if (message.sender == "client") {
				const res = await this.manager.process(this.Language.guess(message.text, ["uz", "en"])[0].alpha2, message.text);
				for (let entity of res.entities) {
					entities.push(entity);
				}
				finalRes = res;
			}
		}
		console.log(entities);
		let answer = await this.parseParams(finalRes.answer, entities);
		let text = finalRes.utterance;
		const out = { text, answer, entities };
		return out;
	}

	/**
	 * @param {string} text
	 */
	async parseParams(text, entities) {
		for (let entity of entities) {
			text = text.replaceAll(`{{${entity.entity}}}`, entity.option);
		}
		return text;
	}
}

module.exports = { Lisa };
