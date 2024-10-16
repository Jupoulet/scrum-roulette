// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getSquadMembers, patchMember, resetMembers} from "../../../api/notion/NotionAPI";
import {DateObjectDTO, getListOfMembersFromDBResponse} from "../../../services/scrum-roulette/ScrumRoulette";
import {DBResult} from "../../../models/Notion.types";
import {postSlackMessageToTakeoff} from "../../../api/slack/SlackAPI";

const getCustomMessage = (member: DateObjectDTO) => {
  switch(member.name) {
    case 'JuP':
      return '_"Le meilleur d\'entre nous 🥇"_';
    case 'Mathieu':
      return '_"Brice d\'Avignon 🤙"_';
    case 'Anne-Emilie':
      return '_"Le puis de savoir 🐘"_';
    case 'Hugo':
      return '_"Celui qui scale 📈"_';
    case 'Jeremy':
      return  '_"Le doctorant du sommeil 👨🏻‍⚕️"_';
    case 'Thibault':
      return '_"... et les 40 funnels 🥷🏻"_';
    case 'Lisa':
      return '_"Spider woman 🧗🏻‍♂️"_'
  }
}

export const scrumRouletteScript = async (author?: string): Promise<string> => {

  console.log('⌛ Retrieving squad members...');
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
  const customMessage = getCustomMessage(pickRandomMember);
  if (pickRandomMember) {
    try {
      await postSlackMessageToTakeoff([
        author ? {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🎲 <@${author}> Asked for a reroll`,
          }
        } : undefined,
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `👑 *Assigned for today is <@${pickRandomMember.slackId}> !*`,
          }
        },
        customMessage ? {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: customMessage,
          }
        } : undefined,
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Assignee not available ? Click the button to reroll:'
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
      ].filter(Boolean));
    } catch (e) {
      console.error(e);
    }
  }
  return `👑 The chosen one for today is: ${pickRandomMember.name}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const message: string = await scrumRouletteScript();
  res.status(200).json({ message })
}
