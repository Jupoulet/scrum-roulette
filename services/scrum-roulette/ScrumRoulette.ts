import {DBResult, TitleObject, SelectObject, RichTextObject, MultiSelectObject, DateObject} from '../../models/Notion.types';

export type Status = 'available' | 'already-assigned';
type Include = 'yes' | 'no';

export interface DateObjectDTO {
  status: Status;
  include: Include;
  name: string;
  slackId: string;
  excluded_days: (1 | 2 | 3 | 4 | 5 | undefined)[];
  assigned_until: string | undefined;
  id: string;
}

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export const getListOfMembersFromDBResponse = (members: DBResult): DateObjectDTO[] => {
  return members.map((member) => ({
      status: (member.properties.status as SelectObject<Status>).select.name,
      include: (member.properties.include as SelectObject<Include>).select.name,
      name: (member.properties.Name as TitleObject).title[0].plain_text,
      slackId: (member.properties.slackId as RichTextObject).rich_text[0].plain_text,
      assigned_until: (member.properties.assigned_until as DateObject).date?.start,
      id: member.id,
      excluded_days: (member.properties.excluded_days as MultiSelectObject).multi_select.map((select) => getDayNumber(select.name as Day))
    })
  )
}

export const getDayNumber = (day: Day) => {
  if (day === 'monday') return 1
  if (day === 'tuesday') return 2
  if (day === 'wednesday') return 3
  if (day === 'thursday') return 4
  if (day === 'friday') return 5
}