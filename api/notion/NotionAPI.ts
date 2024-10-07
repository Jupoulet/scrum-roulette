import { Client } from "@notionhq/client"
import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import {Status} from "../../services/scrum-roulette/ScrumRoulette";

const notion = new Client({ auth: process.env.NOTION_KEY });

export const getDepsOwnerMembers = async (): Promise<QueryDatabaseResponse | undefined> => {
  const database_id = process.env.NOTION_DEPS_OWNER_DB_ID;
  if (!database_id || !process.env.NOTION_KEY) return;
  try {
    const response = await notion.databases.query({
      database_id,
    });
    return response
  } catch (e) {
    console.error(e);
  }
}

export const getSquadMembers = async (): Promise<QueryDatabaseResponse | undefined> => {
  const database_id = process.env.NOTION_DATABASE_ID;

  if (!database_id || !process.env.NOTION_KEY) return;
  try {
    const response = await notion.databases.query({
      database_id,
    });
    return response
  } catch (e) {
    console.error(e);
  }
}

export const patchMember = async (member: any, value: Status) => {
  const response = await notion.pages.update({
    page_id: member.id,
    properties: {
      status: {
        select: {
          name: value,
        },
      },
    },
  });
}
export const resetMembers = async (members: any) => {
  await Promise.all(members.map((member: any) => patchMember(member, 'available')));
}
