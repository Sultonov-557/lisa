const { BayesClassifier } = require("natural");
const db = require("./db/db");

const lisa = new BayesClassifier();

db.onreload = () => {
	for (let i of db.getData()) {
		lisa.addDocument(i.value, i.label);
	}
	lisa.retrain();
};

db.onreload();
lisa.train();

function classify(text, userID) {
	text = text.split("");
	text = text.filter((v) => {
		if (v.toLowerCase() == v.toUpperCase() && isNaN(+v) && ![".", "?"].includes(v)) {
			return false;
		} else {
			return true;
		}
	});
	text = text.join("");

	const type = lisa.classify(text);

	const classification = { type, text };
	return classification;
}

module.exports = { classify };
