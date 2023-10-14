const { SlashCommandBuilder } = require("discord.js");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// You should have a function to determine eligible participants.
// Replace this with your own logic to get eligible participants.
function getEligibleParticipants() {
	// For demonstration purposes, returning a static list of eligible participants.
	return ["User1", "User2", "User3"];
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("export")
		.setDescription("Export a list of eligible participants to a PDF."),
	async execute(interaction) {
		// Determine the eligible participants (modify this as needed)
		const eligibleParticipants = getEligibleParticipants();

		// Create a PDF document
		const doc = new PDFDocument();
		const output = fs.createWriteStream("eligible_participants.pdf");

		// Pipe the PDF document to a writable stream
		doc.pipe(output);

		// Write the list of eligible participants to the PDF
		doc.fontSize(12).text("List of Eligible Participants:", 50, 50);

		for (let i = 0; i < eligibleParticipants.length; i++) {
			doc.fontSize(12).text(
				`${i + 1}. ${eligibleParticipants[i]}`,
				50,
				80 + i * 20
			);
		}

		// Finalize the PDF document
		doc.end();

		// Reply to the user with the PDF
		await interaction.reply({
			content: "Here is the list of eligible participants:",
			files: ["./eligible_participants.pdf"],
		});
	},
};
