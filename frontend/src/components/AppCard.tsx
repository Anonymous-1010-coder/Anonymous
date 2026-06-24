'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { App } from '@/types';
import { api } from '@/lib/api';

interface AppCardProps {
  app: App;
  index?: number;
  showDelete?: boolean;
  onDelete?: (id: number) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function AppCard({ app, index = 0, showDelete, onDelete }: AppCardProps) {
  const isApk = app.fileType === 'APK';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="card overflow-hidden card-hover group"
    >
      {/* Cover Image */}
      <div className="relative h-36 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
        {app.coverImageUrl ? (
          <img
            src={`${API_URL}/uploads/${app.coverImageUrl}`}
            alt={app.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {app.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={isApk ? 'badge badge-apk' : 'badge badge-exe'}>
            {app.fileType}
          </span>
        </div>
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-gray-300">
          {formatSize(app.fileSize)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-1 truncate group-hover:text-primary transition-colors">
          {app.name}
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3 min-h-[2rem]">
          {app.description || 'No description provided.'}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>{app.downloads} downloads</span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/app/${app.id}`}
            className="flex-1 text-center py-2 rounded-lg text-xs font-medium transition-all border border-surface-border text-gray-300 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
          >
            View Details
          </Link>
          <a
            href={api.apps.downloadUrl(app.id)}
            className="py-2 px-4 rounded-lg text-xs font-medium transition-all btn-primary"
          >
            Download
          </a>
          {showDelete && onDelete && (
            <button
              onClick={() => onDelete(app.id)}
              className="btn-danger py-2 px-3 text-xs"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
