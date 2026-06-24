import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function listUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, username: true, email: true, role: true, banned: true,
        createdAt: true, updatedAt: true,
        _count: { select: { apps: true } },
      },
    });
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateUserRole(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (id === req.userId) {
      res.status(400).json({ error: 'Cannot change your own role' });
      return;
    }

    const { role } = req.body;
    if (!role || role !== 'admin') {
      res.status(400).json({ error: 'Role must be admin' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role === 'superadmin') {
      res.status(403).json({ error: 'Cannot modify a superadmin' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, email: true, role: true, banned: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function toggleBan(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (id === req.userId) {
      res.status(400).json({ error: 'Cannot ban yourself' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role === 'superadmin') {
      res.status(403).json({ error: 'Cannot modify a superadmin' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { banned: !user.banned },
      select: { id: true, username: true, email: true, role: true, banned: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Toggle ban error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateUserCredentials(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role === 'superadmin' && id !== req.userId) {
      res.status(403).json({ error: 'Cannot modify a superadmin' });
      return;
    }

    const data: any = {};
    if (req.body.username) data.username = req.body.username;
    if (req.body.email) data.email = req.body.email;
    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }
      data.password = await bcrypt.hash(req.body.password, 12);
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, username: true, email: true, role: true, banned: true },
    });

    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }
    console.error('Update credentials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { username, email, password: hashed, role: 'admin' },
      select: { id: true, username: true, email: true, role: true, banned: true, createdAt: true, _count: { select: { apps: true } } },
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteUser(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (id === req.userId) {
      res.status(400).json({ error: 'Cannot delete yourself' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role === 'superadmin') {
      res.status(403).json({ error: 'Cannot delete a superadmin' });
      return;
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
