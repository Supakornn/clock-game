// src/pages/api/getTicketCode.ts
import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: 'You look sus',
  statusCode: 429,
  keyGenerator: (req: NextApiRequest) => req.headers['user-agent'] || req.body.userId,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  limiter(req, res, () => {
    const { timeElapsed } = req.body;
    const targetTime = parseFloat(process.env.TARGET_TIME || '0');
    const allowedRange = 0.5;
    if ((Math.abs(timeElapsed - targetTime) < allowedRange) && req.body.btnRunningTimes >=3 && req.body.errorCount > 0) {
      res.status(200).json({ success: true, ticketCode: process.env.TICKET_CODE });
    } else {
      res.status(403).json({ success: false, message: "Validation failed. Time does not match the target." });
    }
  });
}
