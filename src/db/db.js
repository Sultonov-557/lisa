const fs = require("fs");

const dataPath = __dirname + "/data.json";
const usersPath = __dirname + "/users.json";

let data = JSON.parse(fs.readFileSync(dataPath).toString());
let users = JSON.parse(fs.readFileSync(usersPath).toString());

fs.watchFile(dataPath, () => {
	data = JSON.parse(fs.readFileSync(dataPath).toString());
	onreload();
});

fs.watchFile(usersPath, () => {
	users = JSON.parse(fs.readFileSync(usersPath).toString());
});

function getData() {
	const mapedData = [];
	for (let label in data) {
		for (let value of data[label]) {
			mapedData.push({ label, value });
		}
	}
	return mapedData;
}

function getUser(userID) {
	return users[userID];
}

function newUser(userID, name, kindness, age) {
	users[userID] = { name, kindness, age };
}

let onreload = () => {};

module.exports = { getData, getUser, onreload };
