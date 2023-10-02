import {NextApiRequest, NextApiResponse} from "next";
import {scrumRouletteScript} from "@/pages/api/scrum-roulette";

const reroll = (author: string) => {
  return scrumRouletteScript(author);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'Not found' });
  }
  const result = req.body;
  console.log('PAYLOAD', result.payload);
  res.status(200).json({ message: 'Cool' })
/*  const firstActionId = result.payload.actions.find((action: { action_id: string }) => !!action.action_id);

  switch (firstActionId) {
    case 'reroll-roulette':
      return reroll(result.payload.user.id);
    default:
      res.status(404).json({ message: `Unhandled action: ${firstActionId}` })
  }*/
}