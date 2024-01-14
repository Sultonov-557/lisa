const readline = require("readline");
const lisa = require("./index");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
chat();
function chat() {
	rl.question("You: ", async (userInput) => {
		const botResponse = await lisa.ask(userInput);
		console.log(`Lisa: ${botResponse.answer}`);
		chat();
	});
}
