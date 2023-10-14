const { SlashCommandBuilder } = require("discord.js");
const { Challenge, User } = require("../models/appSchema"); // Import your models

module.exports = {
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription("Verify your daily challenge entry.")
		.addStringOption((option) =>
			option
				.setName("challenge_name")
				.setDescription("Name of the challenge to verify.")
				.setRequired(true)
		),
	async execute(interaction) {
		const user = interaction.user;
		const challengeName = interaction.options.getString("challenge_name");

		try {
			// Find the user by Discord ID and populate their challenges
			const userData = await User.findOne({
				discordId: user.id,
			}).populate("challenges");

			if (!userData || userData.challenges.length === 0) {
				await interaction.reply(
					"You are not participating in any challenges."
				);
				return;
			}

			// Find the challenge with the specified name
			const challenge = userData.challenges.find(
				(c) => c.name === challengeName
			);

			if (!challenge) {
				await interaction.reply(
					"Challenge not found. Please check the challenge name."
				);
				return;
			}

			// Check the user's entries for the specified challenge
			const userEntries = challenge.posts.filter((entry) => {
				// Check if the entry date is today
				const entryDate = new Date(entry.date);
				const today = new Date();
				return (
					entryDate.getDate() === today.getDate() &&
					entryDate.getMonth() === today.getMonth() &&
					entryDate.getFullYear() === today.getFullYear()
				);
			});

			if (userEntries.length > 0) {
				await interaction.reply(
					"You have submitted an entry for today. Great job!"
				);
			} else {
				await interaction.reply(
					"You haven't submitted an entry for today."
				);
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: "There was an error while processing your request.",
				ephemeral: true, // Only visible to the user
			});
		}
	},
};
