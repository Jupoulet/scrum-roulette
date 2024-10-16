import { NextApiRequest, NextApiResponse } from "next";
import { getDepsOwnerMembers, patchMember, resetMembers } from "../../../api/notion/NotionAPI";
import { getListOfMembersFromDBResponse } from "../../../services/scrum-roulette/ScrumRoulette";
import { DBResult } from "../../../models/Notion.types";
import { postSlackMessageToFrontSecret } from "../../../api/slack/SlackAPI";

export const depsOwnerRouletteScript = async (author?: string): Promise<string> => {
  const frontMembers = await getDepsOwnerMembers();
  console.log('front members', frontMembers);
  const mappedSquadMembers = getListOfMembersFromDBResponse(frontMembers?.results as DBResult);
  const today = new Date()
  const numberDayOfToday = today.getDay();
  const membersPresent = mappedSquadMembers.filter((member) => {
    return member.include === 'yes' && !member.excluded_days.includes(numberDayOfToday as 1 | 2 | 3 | 4 | 5)
  });

  if (!membersPresent.length || !frontMembers) {
    console.log('🌬️ No members wants to be part of the game.');
    return '🌬️ No members wants to be part of the game.';
  }

  const membersAvailable = membersPresent.filter((member) => member.status === 'available');

  if (!membersAvailable.length) {
    console.log('🧹 Cleaning squad members status...');
    await resetMembers(mappedSquadMembers);
    console.log('✅ Done !');
    return depsOwnerRouletteScript();
  }

  const pickRandomMember = membersAvailable[Math.floor(Math.random() * membersAvailable.length)];
  console.log(`👑 The chosen one for today is: ${pickRandomMember.name}`);
  await patchMember(frontMembers.results.find((member) => member.id === pickRandomMember.id), 'already-assigned');
  if (pickRandomMember) {
    try {
      await postSlackMessageToFrontSecret([
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
            text: `👑 *New Deps owner for the next 2 weeks is <@${pickRandomMember.slackId}> !*`,
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Assignee too busy or lazy ? Click the button to reroll:'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Reroll'
            },
            action_id: 'reroll-deps-owner-roulette',
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
  const message = await depsOwnerRouletteScript(req.body.author);
  res.status(200).json({ message });
};
