const readline = require("readline");
const lisa = require("./index");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const conversation = [];

chat();
function chat() {
	rl.question("You: ", async (userInput) => {
		conversation.push({ sender: "client", text: userInput });
		const botResponse = await lisa.sendMessage(conversation);
		conversation.push({ sender: "server", text: botResponse.answer });
		console.log(`Lisa: ${botResponse.answer}`);
		chat();
	});
}
