// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getSquadMembers, patchMember, resetMembers} from "../../../api/notion/NotionAPI";
import {getListOfMembersFromDBResponse} from "../../../services/scrum-roulette/ScrumRoulette";
import {DBResult} from "../../../models/Notion.types";
import {postSlackMessage} from "../../../api/slack/SlackAPI";
import {Headers} from "node-fetch";

const toto = async () => {
  const result = await fetch('https://hooks.slack.com/services/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', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `👑 *Assigned for today is toto !*`,
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
            action_id: 'reroll-roulette',
          }
        }
      ],
    }),
  });

  console.log('result', result);

  return 'Oui';
}

const scrumRouletteScript = async (): Promise<string> => {

  return toto();
/*  console.log('⌛ Retrieving squad members...');
  const squadMembers = await getSquadMembers();
  const mappedSquadMembers = getListOfMembersFromDBResponse(squadMembers?.results as DBResult);
  const today = new Date()
  const numberDayOfToday = today.getDay();
  const membersPresent = mappedSquadMembers.filter((member) => {
    return member.include === 'yes' && !member.excluded_days.includes(numberDayOfToday as 1 | 2 | 3 | 4 | 5)
  });

  if (!membersPresent.length || !squadMembers) {
    console.log('🌬️ No members wants to be part of the game.');
    return '🌬️ No members wants to be part of the game.';
  }

  const membersAvailable = membersPresent.filter((member) => member.status === 'available');

  if (!membersAvailable.length) {
    console.log('🧹 Cleaning squad members status...');
    await resetMembers(mappedSquadMembers);
    console.log('✅ Done !');
    return scrumRouletteScript();
  }

  const pickRandomMember = membersAvailable[Math.floor(Math.random() * membersAvailable.length)];
  console.log(`👑 The chosen one for today is: ${pickRandomMember.name}`);
  await patchMember(squadMembers.results.find((member) => member.id === pickRandomMember.id), 'already-assigned');
  if (pickRandomMember) {
    await postSlackMessage(`👑 *Assigned for today is <@${pickRandomMember.slackId}> !*`, [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `👑 *Assigned for today is <@${pickRandomMember.slackId}> !*`,
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
          action_id: 'reroll-roulette',
        }
      }
    ]);
  }
  return `👑 The chosen one for today is: ${pickRandomMember.name}`;*/
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const message: string = await scrumRouletteScript();
  res.status(200).json({ message })
}
