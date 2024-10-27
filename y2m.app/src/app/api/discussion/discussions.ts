// File: /pages/api/discussions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { groupId } = req.query;

  if (req.method === 'GET') {
    try {
      const discussions = await prisma.thread.findMany({
        where: { groupId: Number(groupId) },
      });

      res.status(200).json({ discussions });
    } catch (error) {
      console.error('Error fetching discussions:', error);
      res.status(500).json({ error: 'Failed to fetch discussions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
