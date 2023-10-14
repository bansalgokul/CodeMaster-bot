const { SlashCommandBuilder } = require("discord.js");

const { Challenge } = require("../models/appSchema");
// In-memory storage for user entries (you should use a database in a production environment)
const userEntries = new Map();

const isValidDate = (dateString) => {
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(dateString)) return false;
	const parts = dateString.split("-");
	const year = parseInt(parts[0], 10);
	const month = parseInt(parts[1], 10);
	const day = parseInt(parts[2], 10);
	if (
		year < 1000 ||
		year > 9999 ||
		month == 0 ||
		month > 12 ||
		day == 0 ||
		day > 31
	) {
		return false;
	}
	return true;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("createchallenge")
		.setDescription("Create a new challenge.")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Name of the challenge")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("description")
				.setDescription("Description of the challenge")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("start_date")
				.setDescription("Start date of the challenge (YYYY-MM-DD)")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("end_date")
				.setDescription("End date of the challenge (YYYY-MM-DD)")
				.setRequired(true)
		),
	async execute(interaction) {
		const user = interaction.user;
		const challengeName = interaction.options.getString("name");
		const challengeDescription =
			interaction.options.getString("description");
		const startDateString = interaction.options.getString("start_date");
		const endDateString = interaction.options.getString("end_date");

		// Check if the user has the necessary permissions (e.g., server admin)
		if (!interaction.member.permissions.has("ADMINISTRATOR")) {
			await interaction.reply(
				"You do not have permission to create challenges."
			);
			return;
		}

		// Validate the start date
		if (!isValidDate(startDateString)) {
			await interaction.reply(
				"Invalid start date format. Please use YYYY-MM-DD."
			);
			return;
		}

		// Validate the end date
		if (!isValidDate(endDateString)) {
			await interaction.reply(
				"Invalid end date format. Please use YYYY-MM-DD."
			);
			return;
		}

		const startDate = new Date(startDateString);
		const endDate = new Date(endDateString);

		// Check if the end date is after the start date
		if (startDate >= endDate) {
			await interaction.reply("End date must be after the start date.");
			return;
		}

		// Create a new challenge and store it in the database (you should use a database in a production environment)
		const newChallenge = {
			name: challengeName,
			description: challengeDescription,
			startDate: startDate,
			endDate: endDate,
			posts: [],
			isActive: true,
			eligibility: false,
		};

		// Store the challenge data in your database using Mongoose or a similar library
		// For example:
		const challenge = await Challenge.create(newChallenge);
		await interaction.reply("New challenge created!");
	},
};
