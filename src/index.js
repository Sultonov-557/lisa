const { BayesClassifier } = require("natural");
const fs = require("fs");

let data = JSON.parse(fs.readFileSync(__dirname + "/data.json").toString());

const lisa = new BayesClassifier();

fs.watchFile(__dirname + "/data.json", () => {
	try {
		data = JSON.parse(fs.readFileSync(__dirname + "/data.json").toString());

		lisa.docs = [];

		for (let label in data) {
			for (let value of data[label]) {
				lisa.addDocument(value, label);
			}
		}

		lisa.train();
	} catch {}
});

for (let label in data) {
	for (let value of data[label]) {
		lisa.addDocument(value, label);
	}
}

lisa.train();

function addWord(label, value) {
	data[label].push(value);
	fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data, null, 4));
}

function ask(text) {
	text = text
		.split("")
		.filter((v) => {
			if (v.toLowerCase() == v.toUpperCase() && v != " " && v != ":" && v != "?" && isNaN(+v)) {
				return false;
			} else {
				return true;
			}
		})
		.join("")
		.toLowerCase();

	if (text == "" || text == " ") return "bosh";

	return lisa.classify(text);
}

module.exports = { ask, addWord };
