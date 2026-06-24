-- Paste this into Supabase SQL Editor

CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    banned BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "App" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "coverImageUrl" TEXT,
    "previewUrl" TEXT,
    "videoUrl" TEXT,
    "trimStart" DOUBLE PRECISION,
    "trimEnd" DOUBLE PRECISION,
    downloads INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "DeviceInfo" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    ip TEXT,
    "userAgent" TEXT,
    platform TEXT,
    language TEXT,
    timezone TEXT,
    "screenWidth" INTEGER,
    "screenHeight" INTEGER,
    "deviceMemory" DOUBLE PRECISION,
    "hardwareConcurrency" INTEGER,
    "connectionType" TEXT,
    "batteryLevel" DOUBLE PRECISION,
    "batteryCharging" BOOLEAN,
    "touchSupported" BOOLEAN,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_device_user FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_app_userId ON "App"("userId");
CREATE INDEX IF NOT EXISTS idx_app_fileType ON "App"("fileType");
CREATE INDEX IF NOT EXISTS idx_app_createdAt ON "App"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_app_downloads ON "App"(downloads DESC);
CREATE INDEX IF NOT EXISTS idx_device_userId ON "DeviceInfo"("userId");
CREATE INDEX IF NOT EXISTS idx_device_createdAt ON "DeviceInfo"("createdAt" DESC);
