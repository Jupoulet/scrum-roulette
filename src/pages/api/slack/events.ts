import {NextApiRequest, NextApiResponse} from "next";
import {postSlackMessage} from "../../../../api/slack/SlackAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  console.log('BONSOIR');
  if (req.method !== 'POST') {
    return res.status(404).json({ message: 'Not found' });
  }
  const payload = req.body;
  await postSlackMessage(`Hello moi: ${payload}`)
  res.status(200).json({ message: 'Ok' });
}