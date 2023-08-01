import { config } from "dotenv"
config();
import {getSquadMembers, patchMember, resetMembers} from './api/notion/NotionAPI.js';
import {getListOfMembersFromDBResponse} from "./services/scrum-roulette/ScrumRoulette";
import {DBResult} from "./models/Notion.types";
import {postSlackMessage} from "./api/slack/SlackAPI";

const mainScript = async () => {
  console.log('⌛ Retrieving squad members...');
  const squadMembers = await getSquadMembers();
  console.log('✅ Done !')
  const mappedSquadMembers = getListOfMembersFromDBResponse(squadMembers.results as DBResult);
  const today = new Date()
  const numberDayOfToday = today.getDay();
  const membersPresent = mappedSquadMembers.filter((member) => {
    return member.include === 'yes' && !member.excluded_days.includes(numberDayOfToday)
  });

  if (!membersPresent.length) {
    console.log('🌬️ No members wants to be part of the game.');
    return;
  }

  const membersAvailable = membersPresent.filter((member) => member.status === 'available');

  if (!membersAvailable.length) {
    console.log('🧹 Cleaning squad members status...');
    await resetMembers(mappedSquadMembers);
    console.log('✅ Done !');
    return mainScript();
  }

  const pickRandomMember = membersAvailable[Math.floor(Math.random() * membersAvailable.length)];
  console.log(`👑 The chosen one for today is: ${pickRandomMember.name}`);
  await patchMember(squadMembers.results.find((member) => member.id === pickRandomMember.id), 'already-assigned');
  if (pickRandomMember) {
    await postSlackMessage(`👑 Assigned for today is <@${pickRandomMember.slackId}> !`);
  }
}

mainScript();
