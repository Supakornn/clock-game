// THIS IS A FAKE API
// src/pages/api/getGameData.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(500).json({success:false,message: "server is currently unable to handle this request."});
}
