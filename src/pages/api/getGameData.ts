// src/pages/api/getGameData.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const targetTime = parseFloat(process.env.TARGET_TIME || "0");
  const btnRunningTimes = parseFloat(process.env.BTN_RUNNING_TIMES || "0");
  const errorPageTime = parseInt(process.env.ERROR_PAGE_TIME || "0");

  res.status(200).json({ targetTime, btnRunningTimes, errorPageTime });
}
