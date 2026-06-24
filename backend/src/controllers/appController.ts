import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';
import { getFileTypeFromExt } from '../utils/validation';

const prisma = new PrismaClient();

export async function uploadApp(req: AuthRequest, res: Response): Promise<void> {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const appFile = files?.file?.[0];
    if (!appFile) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { name, description, trimStart, trimEnd } = req.body;
    if (!name) {
      res.status(400).json({ error: 'App name is required' });
      return;
    }

    const fileType = getFileTypeFromExt(appFile.originalname);
    const coverImage = files?.coverImage?.[0];
    const video = files?.video?.[0];

    const app = await prisma.app.create({
      data: {
        name,
        description: description || '',
        fileUrl: appFile.filename,
        fileType,
        fileSize: appFile.size,
        coverImageUrl: coverImage?.filename || null,
        videoUrl: video?.filename || null,
        trimStart: trimStart ? parseFloat(trimStart) : null,
        trimEnd: trimEnd ? parseFloat(trimEnd) : null,
        userId: req.userId!,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    res.status(201).json(app);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function listApps(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { search, type, page = '1', limit = '12' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (type) {
      where.fileType = (type as string).toUpperCase();
    }

    const [apps, total] = await Promise.all([
      prisma.app.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          user: { select: { id: true, username: true } },
        },
      }),
      prisma.app.count({ where }),
    ]);

    res.json({
      apps,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('List apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getApp(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid app ID' });
      return;
    }

    const app = await prisma.app.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    if (!app) {
      res.status(404).json({ error: 'App not found' });
      return;
    }

    res.json(app);
  } catch (error) {
    console.error('Get app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function downloadApp(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid app ID' });
      return;
    }

    const app = await prisma.app.findUnique({ where: { id } });
    if (!app) {
      res.status(404).json({ error: 'App not found' });
      return;
    }

    await prisma.app.update({ where: { id }, data: { downloads: { increment: 1 } } });

    const filePath = path.join(config.uploadDir, app.fileUrl);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found on server' });
      return;
    }

    const originalName = `${app.name.replace(/[^a-zA-Z0-9]/g, '_')}.${app.fileType.toLowerCase()}`;
    res.download(filePath, originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMyApps(req: AuthRequest, res: Response): Promise<void> {
  try {
    const apps = await prisma.app.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(apps);
  } catch (error) {
    console.error('My apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteApp(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid app ID' });
      return;
    }

    const app = await prisma.app.findUnique({ where: { id } });
    if (!app) {
      res.status(404).json({ error: 'App not found' });
      return;
    }

    if (app.userId !== req.userId && req.userRole !== 'admin' && req.userRole !== 'superadmin') {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const removeFile = (url: string | null) => {
      if (!url) return;
      const fp = path.join(config.uploadDir, url);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    };
    removeFile(app.fileUrl);
    removeFile(app.coverImageUrl);
    removeFile(app.videoUrl);

    await prisma.app.delete({ where: { id } });
    res.json({ message: 'App deleted successfully' });
  } catch (error) {
    console.error('Delete app error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getFeaturedApps(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const apps = await prisma.app.findMany({
      orderBy: { downloads: 'desc' },
      take: 6,
      include: {
        user: { select: { id: true, username: true } },
      },
    });
    res.json(apps);
  } catch (error) {
    console.error('Featured apps error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
