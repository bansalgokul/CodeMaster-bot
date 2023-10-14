const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(
			"Provides information on how to use the bot and its available commands."
		),
	async execute(interaction) {
		const helpMessage = `
**Available Commands:**
- **/post:** Submit your daily progress with a link to your tweet or LinkedIn post.
  Usage: \`/post [link]\`
- **/missed:** Check if you have missed a day in the challenge.
  Usage: \`/missed\`
- **/verify:** Verify if you have posted daily.
  Usage: \`/verify\`
- **/export:** Export a list of eligible participants to a PDF or document (Moderators only).
  Usage: \`/export\`
- **/moderate:** Filter entries according to eligibility or ineligibility tags set by the bot (Moderators only).
  Usage: \`/moderate [eligible|ineligible]\`
- **/distribute:** Distribute tokens or rewards to eligible participants (Moderators only).
  Usage: \`/distribute\`
- **/help:** Show this help message.
  Usage: \`/help\`

For more information on each command, you can use \`/help [command]\`.

*Note: Commands are case-insensitive.*

    `;

		await interaction.reply(helpMessage);
	},
};
