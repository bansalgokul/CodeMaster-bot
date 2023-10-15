const { SlashCommandBuilder } = require("discord.js");

const axios = require('axios');

// Replace this with your actual function to distribute scaler coins
async function distributeScalerCoinsToUser(user, amount) {
    try {
        // Replace with your actual API endpoint and authentication
        const apiEndpoint = 'https://api.scalercoinservice.com/distribute';
        const apiKey = 'your_api_key_here';

        // Prepare the data payload according to your API's specification
        const payload = {
            user: user, // assuming 'user' is sufficient for identification; you might need more info
            amount: amount
        };

        // Make the POST request to the external API
        const response = await axios.post(apiEndpoint, payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Handle the response according to your needs
        if (response.status === 200) {
            return {
                success: true,
                data: response.data // or whatever part of the response you need
            };
        } else {
            // Handle non-success status codes as needed
            return {
                success: false,
                message: 'Failed to distribute scaler coins due to a non-success status code.'
            };
        }
    } catch (error) {
        // Handle errors as needed (e.g., network errors, API errors)
        console.error('Error distributing scaler coins:', error);
        return {
            success: false,
            message: error.message || 'Unexpected error occurred.'
        };
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('distribute')
        .setDescription('Distribute scaler coins to eligible participants.'),
    async execute(interaction) {
        // Sample entries; in production, these should come from your data source
        const entries = [
            { user: 'User1', eligible: true, content: 'Entry 1' },
            { user: 'User2', eligible: true, content: 'Entry 2' },
            { user: 'User3', eligible: false, content: 'Entry 3' },
            // ... more entries
        ];

        // Filter for eligible participants
        const eligibleParticipants = entries.filter(entry => entry.eligible);

        // Check if there are eligible participants
        if (eligibleParticipants.length === 0) {
            await interaction.reply('No eligible participants found for rewards.');
            return;
        }

        // Distribute rewards and construct response message
        let responseMessage = 'Rewards distributed:\n';

        for (const participant of eligibleParticipants) {
            const amount = 100; // Define the amount or logic to calculate the amount of scaler coins
            const result = await distributeScalerCoinsToUser(participant.user, amount);

            if (result.success) {
                responseMessage += `Distributed ${amount} Scaler Coins to ${participant.user}\n`;
            } else {
                // Log the error and inform the user of the issue
                console.error(`Failed to distribute scaler coins to ${participant.user}: ${result.message}`);
                responseMessage += `Failed to distribute rewards to ${participant.user}\n`;
            }
        }

        // Send the result back in the channel
        await interaction.reply(responseMessage);
    },
};
