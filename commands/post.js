const { SlashCommandBuilder } = require("discord.js");
const { User, Challenge, Post } = require("../models/appSchema");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("post")
		.setDescription(
			"Submit your daily progress with a link to your tweet or LinkedIn post."
		)
		.addStringOption((option) =>
			option
				.setName("challenge_name")
				.setDescription("Name of the challenge")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("link")
				.setDescription("Link to your tweet or LinkedIn post.")
				.setRequired(true)
		),
	async execute(interaction) {
		const user = interaction.user;
		const challengeName = interaction.options.getString("challenge_name");
		const link = interaction.options.getString("link");

		// Validate the link format using a regular expression (you can customize this)
		const linkPattern =
			/^(https:\/\/)?(www\.)?linkedin\.com\/posts\/[a-zA-Z0-9-]+-\d+/i;

		if (!linkPattern.test(link)) {
			await interaction.reply(
				"Invalid link format. Please provide a valid Twitter or LinkedIn link."
			);
			return;
		}

		try {
			// Find the user by Discord ID and populate their challenges
			let userData = await User.findOne({ discordId: user.id }).populate(
				"challenges"
			);

			if (!userData) {
				// If the user is not registered, create a new user
				userData = new User({
					discordId: user.id,
					discordTag: user.tag,
					challenges: [],
				});

				await userData.save();
			}

			// Find the challenge from all challenges
			const challenge = await Challenge.findOne({
				name: challengeName,
				isActive: true,
			});

			if (!challenge) {
				await interaction.reply(
					`Challenge "${challengeName}" not found or not active. Please check the challenge name.`
				);
				return;
			}

			// Check if the user has already submitted an entry for today
			const today = new Date();
			const entryDate = today.toDateString();
			const existingEntry = challenge.posts.find((post) => {
				const postDate = post.date;
				console.log(post.userId, userData._id);
				return (
					postDate.getFullYear() === today.getFullYear() &&
					postDate.getMonth() === today.getMonth() &&
					postDate.getDate() === today.getDate() &&
					post.userId.toString() === userData._id.toString()
				);
			});

			if (existingEntry) {
				await interaction.reply(
					`You've already submitted an entry for today in the "${challenge.name}" challenge.`
				);
			} else {
				// Register the user for the challenge if they are not already registered
				if (!userData.challenges.some((c) => c.equals(challenge._id))) {
					userData.challenges.push(challenge);
					await userData.save();
				}

				// Create a new entry and save it in the database
				const newPost = new Post({
					date: today,
					link: link,
					userId: userData._id,
					isValid: true, // You can implement validation logic here
				});

				challenge.posts.push(newPost);
				await challenge.save();
				await interaction.reply(
					`Your daily progress for the "${challenge.name}" challenge has been recorded.`
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
