// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {getSquadMembers, patchMember, resetMembers} from "../../../api/notion/NotionAPI";
import {getListOfMembersFromDBResponse} from "../../../services/scrum-roulette/ScrumRoulette";
import {DBResult} from "../../../models/Notion.types";
import {postSlackMessage} from "../../../api/slack/SlackAPI";

type Data = {
  name: string
}

const scrumRouletteScript = async () => {
  console.log('⌛ Retrieving squad members...');
  const squadMembers = await getSquadMembers();
  const mappedSquadMembers = getListOfMembersFromDBResponse(squadMembers.results as DBResult);
  const today = new Date()
  const numberDayOfToday = today.getDay();
  const membersPresent = mappedSquadMembers.filter((member) => {
    return member.include === 'yes' && !member.excluded_days.includes(numberDayOfToday)
  });

  if (!membersPresent.length) {
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
    // await postSlackMessage(`👑 Assigned for today is <@${pickRandomMember.slackId}> !`);
  }
  return `👑 The chosen one for today is: ${pickRandomMember.name}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const message = await scrumRouletteScript();
  res.status(200).json({ message })
}
