import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export async function reportDevice(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      userAgent,
      platform,
      language,
      timezone,
      screenWidth,
      screenHeight,
      deviceMemory,
      hardwareConcurrency,
      connectionType,
      batteryLevel,
      batteryCharging,
      touchSupported,
      latitude,
      longitude,
    } = req.body;

    const device = await prisma.deviceInfo.create({
      data: {
        userId,
        ip: req.ip || req.socket.remoteAddress || null,
        userAgent: userAgent || null,
        platform: platform || null,
        language: language || null,
        timezone: timezone || null,
        screenWidth: screenWidth ? Number(screenWidth) : null,
        screenHeight: screenHeight ? Number(screenHeight) : null,
        deviceMemory: deviceMemory ? Number(deviceMemory) : null,
        hardwareConcurrency: hardwareConcurrency ? Number(hardwareConcurrency) : null,
        connectionType: connectionType || null,
        batteryLevel: batteryLevel ? Number(batteryLevel) : null,
        batteryCharging: batteryCharging === null ? null : Boolean(batteryCharging),
        touchSupported: touchSupported === null ? null : Boolean(touchSupported),
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
      },
    });

    res.status(201).json({ message: 'Device info recorded', id: device.id });
  } catch (error) {
    console.error('Report device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getAllDevices(req: AuthRequest, res: Response): Promise<void> {
  try {
    const devices = await prisma.deviceInfo.findMany({
      include: {
        user: { select: { id: true, username: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteDevice(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid device ID' });
      return;
    }

    const device = await prisma.deviceInfo.findUnique({ where: { id } });
    if (!device) {
      res.status(404).json({ error: 'Device log not found' });
      return;
    }

    await prisma.deviceInfo.delete({ where: { id } });
    res.json({ message: 'Device log deleted' });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
