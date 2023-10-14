const { SlashCommandBuilder } = require("discord.js");

// In-memory storage for user entries (you should use a database in a production environment)
const userEntries = new Map();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("missed")
		.setDescription("Check if you have missed a day in the challenge."),
	async execute(interaction) {
		const user = interaction.user;

		// Check if the user has submitted an entry for today
		if (userEntries.has(user.id)) {
			await interaction.reply(
				"You've already submitted an entry for today. You haven't missed a day!"
			);
		} else {
			await interaction.reply("You have missed a day in the challenge.");
		}
	},
};
