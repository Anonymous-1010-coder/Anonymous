export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  banned?: boolean;
}

export interface App {
  id: number;
  name: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  coverImageUrl: string | null;
  videoUrl: string | null;
  trimStart: number | null;
  trimEnd: number | null;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: { id: number; username: string };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AppsResponse {
  apps: App[];
  pagination: Pagination;
}
