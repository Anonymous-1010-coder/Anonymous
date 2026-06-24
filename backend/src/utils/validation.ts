const APP_EXTENSIONS = ['.apk', '.exe'];
const APP_MIME_TYPES = [
  'application/vnd.android.package-archive',
  'application/x-msdownload',
  'application/octet-stream',
  'application/x-dosexec',
];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.webm'];
const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm'];

export function validateFileType(filename: string, mimetype: string): boolean {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();
  if (!APP_EXTENSIONS.includes(ext)) return false;
  if (APP_MIME_TYPES.length > 0 && !APP_MIME_TYPES.includes(mimetype)) {
    if (mimetype === 'application/octet-stream') return true;
    return false;
  }
  return true;
}

export function validateImageType(filename: string, mimetype: string): boolean {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext) && IMAGE_MIME_TYPES.includes(mimetype);
}

export function validateVideoType(filename: string, mimetype: string): boolean {
  const ext = '.' + filename.split('.').pop()?.toLowerCase();
  return VIDEO_EXTENSIONS.includes(ext) && VIDEO_MIME_TYPES.includes(mimetype);
}

export function getFileTypeFromExt(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'apk') return 'APK';
  if (ext === 'exe') return 'EXE';
  return 'UNKNOWN';
}
