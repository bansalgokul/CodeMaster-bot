const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
// Import the client from index.js

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const commandsDirectory = path.join(__dirname, "commands");

const commandFiles = fs
	.readdirSync(commandsDirectory)
	.filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
	const command = require(path.join(commandsDirectory, file));
	if (command.data) {
		// Add the command data to the array
		// console.log(command.data);
		commands.push(command.data.toJSON());
	} else {
		console.error(`Command file '${file}' is missing 'data' property.`);
	}
}

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");

		// Register the commands with Discord
		await rest.put(Routes.applicationCommands(process.env.APP_ID), {
			body: commands,
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}
})();
