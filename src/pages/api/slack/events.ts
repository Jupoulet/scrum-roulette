import {NextApiRequest, NextApiResponse} from "next";
import {postSlackMessage} from "../../../../api/slack/SlackAPI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(404);
  }
  const payload = req.body;
  await postSlackMessage(`Hello moi: ${payload}`)
  res.status(200);
}