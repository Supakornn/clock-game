// src/pages/api/getTicketCode.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { timeElapsed } = req.body;
  const targetTime = parseFloat(process.env.TARGET_TIME || '0');
  const allowedRange = 0.5;

  if (Math.abs(timeElapsed - targetTime) < allowedRange) {
    res.status(200).json({ success: true, ticketCode: process.env.TICKET_CODE });
  } else {
    res.status(403).json({ success: false, message: "Validation failed. Time does not match the target." });
  }
}
