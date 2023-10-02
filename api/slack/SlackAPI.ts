import { WebClient } from '@slack/web-api';

// Initialize Slack WebClient with your API token
const slackToken = process.env.SLACK_API_TOKEN;
const client = new WebClient(slackToken);

// Define the channel and message you want to send
const channelID = 'C04GY8MC36E';

export const postSlackMessage = async (message: string, blocks?: any[]) => {
  try {
    // Send the message to the specified channel
    const result = await client.chat.postMessage({
      channel: channelID,
      text: message,
      blocks,
    });

    console.log('Slack message sent successfully!');
  } catch (error) {
    console.error(`Error sending Slack message: ${error}`);
  }
};

export const postSlackMessageWebhook = async (blocks: any[]) => {
  const result = await fetch(process.env.SLACK_WEBHOOK_URL || '', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      blocks
    }),
  });
}
