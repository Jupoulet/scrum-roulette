import { WebClient } from '@slack/web-api';

// Initialize Slack WebClient with your API token
const slackToken = process.env.SLACK_API_TOKEN;
const client = new WebClient(slackToken);

// Define the channel and message you want to send
const channelID = 'C04GY8MC36E'; // Replace with your desired channel ID

export const postSlackMessage = async (message: string) => {
  try {
    // Send the message to the specified channel
    const result = await client.chat.postMessage({
      channel: channelID,
      text: message,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ' Assignee not available ? Click the button to reroll:'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Reroll'
            },
            action_id: 'button_click',
            url: 'https://scrum-roulette.vercel.app/api/scrum-roulette'
          }
        }
      ]
    });

    console.log('Slack message sent successfully!');
  } catch (error) {
    console.error(`Error sending Slack message: ${error}`);
  }
};
