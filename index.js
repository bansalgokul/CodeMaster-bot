const fs = require("fs");
const path = require("path");
const { Client, Collection, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event handlers for the database connection
db.on("error", (error) => {
	console.error(`MongoDB Connection Error: ${error}`);
});

db.once("open", () => {
	console.log("Connected to MongoDB database.");
});

const client = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent,
	],
});

client.commands = new Collection();

const commands = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));
for (const file of commands) {
	const commandName = file.split(".")[0];
	const command = require(`./commands/${file}`);

	console.log(`Attempting to load command ${commandName}`);
	client.commands.set(commandName, command);
}

client.on("ready", (c) => {
	console.log(`${c.user.tag} is ready`);
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName, options } = interaction;
	const command = client.commands.get(commandName);

	if (!command || interaction.replied) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(process.env.TOKEN);

module.exports = client;
