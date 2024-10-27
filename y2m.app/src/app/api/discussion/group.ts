import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { groupName, description, emails } = req.body;

    try {
      const users = await prisma.user.findMany({
        where: { email: { in: emails } },
        select: { id: true },
      });

      if (users.length !== emails.length) {
        return res.status(400).json({ error: 'One or more email addresses not found' });
      }

      const userIds = users.map((user: { id: number }) => user.id);
      const group = await prisma.group.create({
        data: {
          name: groupName,
          description,
          participants: {
            create: userIds.map((userId: number) => ({ userId, role: 'member' })),
          },
        },
      });

      res.status(201).json({ group });
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ error: 'Failed to create group' });
    }
  } else if (req.method === 'PUT') {
    const { groupId, groupName, description, emails } = req.body;

    try {
      // Find users by emails
      const users = await prisma.user.findMany({
        where: { email: { in: emails } },
        select: { id: true },
      });

      if (users.length !== emails.length) {
        return res.status(400).json({ error: 'One or more email addresses not found' });
      }

      const userIds = users.map((user: { id: number }) => user.id);

      // Update the group with new data
      const updatedGroup = await prisma.group.update({
        where: { id: groupId },
        data: {
          name: groupName,
          description,
          participants: {
            deleteMany: {}, // Remove all existing participants
            create: userIds.map((userId: number) => ({ userId, role: 'member' })), // Add updated participants
          },
        },
      });

      res.status(200).json({ updatedGroup });
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(500).json({ error: 'Failed to update group' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
