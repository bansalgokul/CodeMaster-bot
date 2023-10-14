const { SlashCommandBuilder } = require("discord.js");

// Define a function to filter entries based on eligibility tags
function filterByEligibility(entries) {
	// Implement your logic to filter entries with eligibility tags here
	// For demonstration purposes, returning a static list of eligible entries.
	return entries.filter((entry) => entry.eligible);
}

// Define a function to filter entries based on ineligibility tags
function filterByIneligibility(entries) {
	// Implement your logic to filter entries with ineligibility tags here
	// For demonstration purposes, returning a static list of ineligible entries.
	return entries.filter((entry) => !entry.eligible);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("moderate")
		.setDescription(
			"Moderate entries based on eligibility or ineligibility tags."
		)
		.addStringOption((option) =>
			option
				.setName("filter")
				.setDescription("Filter entries by 'eligible' or 'ineligible'")
				.setRequired(true)
				.addChoices(
					{ name: "Eligible", value: "eligible" },
					{ name: "Ineligible", value: "ineligible" }
				)
		),
	async execute(interaction) {
		const filterOption = interaction.options.getString("filter");

		// Assume you have a list of entries with eligibility tags
		const entries = [
			{ user: "User1", eligible: true, content: "Entry 1" },
			{ user: "User2", eligible: false, content: "Entry 2" },
			// Add more entries here...
		];

		let filteredEntries;

		if (filterOption === "eligible") {
			// Filter entries based on eligibility
			filteredEntries = filterByEligibility(entries);
		} else if (filterOption === "ineligible") {
			// Filter entries based on ineligibility
			filteredEntries = filterByIneligibility(entries);
		} else {
			await interaction.reply(
				"Invalid filter option. Please select 'eligible' or 'ineligible'."
			);
			return;
		}

		// Create a formatted message with the filtered entries
		const message = filteredEntries
			.map((entry, index) => {
				return `${index + 1}. User: ${entry.user}, Content: ${
					entry.content
				}`;
			})
			.join("\n");

		// Reply to the user with the filtered entries
		await interaction.reply(
			`Filtered entries (${filterOption}): \n${message}`
		);
	},
};
