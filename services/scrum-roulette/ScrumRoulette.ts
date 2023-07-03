import {DBResult, TitleObject, SelectObject, RichTextObject } from '../../models/Notion.types';

export type Status = 'available' | 'already-assigned';
type Include = 'yes' | 'no';
interface DateObjectDTO {
  status: Status;
  include: Include;
  name: string;
  slackId: string;
  id: string;
}

export const getListOfMembersFromDBResponse = (members: DBResult): DateObjectDTO[] => {
  return members.map((member) => ({
    status: (member.properties.status as SelectObject<Status>).select.name,
    include: (member.properties.include as SelectObject<Include>).select.name,
    name: (member.properties.Name as TitleObject).title[0].plain_text,
    slackId: (member.properties.slackId as RichTextObject).rich_text[0].plain_text,
    id: member.id,
  }))
}