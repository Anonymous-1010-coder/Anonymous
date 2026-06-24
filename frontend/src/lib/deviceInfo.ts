export interface DeviceInfoData {
  userAgent: string;
  platform: string;
  language: string;
  timezone: string;
  screenWidth: number;
  screenHeight: number;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  connectionType: string | null;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  touchSupported: boolean;
  latitude: number | null;
  longitude: number | null;
}

export async function collectDeviceInfo(): Promise<DeviceInfoData> {
  const info: DeviceInfoData = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenWidth: screen.width,
    screenHeight: screen.height,
    deviceMemory: (navigator as any).deviceMemory ?? null,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    connectionType: null,
    batteryLevel: null,
    batteryCharging: null,
    touchSupported: 'ontouchstart' in window,
    latitude: null,
    longitude: null,
  };

  if ((navigator as any).connection) {
    info.connectionType = (navigator as any).connection.effectiveType || null;
  }

  try {
    const battery = await (navigator as any).getBattery?.();
    if (battery) {
      info.batteryLevel = battery.level;
      info.batteryCharging = battery.charging;
    }
  } catch {}

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
    );
    info.latitude = position.coords.latitude;
    info.longitude = position.coords.longitude;
  } catch {}

  return info;
}
