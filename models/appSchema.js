const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for individual posts
const PostSchema = new Schema({
	date: { type: Date, required: true, default: Date.now }, // When the post was made
	link: { type: String, required: true }, // Link to LinkedIn/Twitter post
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User", // Reference to the User model
	},
	isValid: { type: Boolean, required: true, default: false }, // If the post meets the challenge requirements
});

// Schema for the challenges
const ChallengeSchema = new Schema({
	name: { type: String, required: true, unique: true }, // Name of the challenge
	description: { type: String }, // Description of the challenge
	startDate: { type: Date, required: true, default: Date.now }, // Global start date of the challenge
	endDate: { type: Date }, // Global end date of the challenge
	posts: [PostSchema], // Posts made by the user
	isActive: { type: Boolean, required: true, default: true }, // If the challenge is currently active
	eligibility: { type: Boolean, default: false }, // If the user is eligible for rewards
});

const UserSchema = new Schema({
	discordId: { type: String, required: true, unique: true }, // Discord ID of the user
	discordTag: { type: String, required: true }, // Discord Tag of the user
	challenges: [
		{
			type: Schema.Types.ObjectId,
			ref: "Challenge", // Reference to the Challenge model
		},
	],
});

// Create a model for the Challenge
const Challenge = mongoose.model("Challenge", ChallengeSchema);
// Create a model for the User
const User = mongoose.model("User", UserSchema);
const Post = mongoose.model("Post", PostSchema);

// Export the Challenge model
module.exports = { Challenge, User, Post };
