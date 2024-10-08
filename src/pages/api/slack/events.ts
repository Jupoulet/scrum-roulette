import {NextApiRequest, NextApiResponse} from "next";
import {scrumRouletteScript} from "@/pages/api/scrum-roulette";
import {depsOwnerRouletteScript} from "@/pages/api/deps_owner_roulette";

const reroll = (author: string) => {
  return scrumRouletteScript(author);
}

const rerollDepsOwnerRoulette = (author: string) => {
  console.log('👑 Rerolling Deps owner roulette');
  return depsOwnerRouletteScript(author);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'Not found' });
  }
  const payload = JSON.parse(req.body.payload);

  const firstActionId = payload.actions.find((action: { action_id: string }) => !!action.action_id)?.action_id;

  switch (firstActionId) {
    case 'reroll-roulette':
      return reroll(payload.user.id);
    case 'reroll-deps-owner-roulette':
      return rerollDepsOwnerRoulette(payload.user.id);
    default:
      res.status(404).json({ message: `Unhandled action: ${firstActionId}` })
  }
}