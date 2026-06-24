'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { App } from '@/types';
import { useAuth } from '@/app/layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function AppDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api.apps.get(parseInt(id, 10))
      .then(setApp)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="skeleton h-64 w-full rounded-xl" />
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-gray-400 font-medium">{error || 'App not found'}</p>
        <button onClick={() => router.push('/')} className="btn-primary mt-6">Go Home</button>
      </div>
    );
  }

  const isApk = app.fileType === 'APK';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-primary transition-colors mb-6 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Cover Image */}
        <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10 mb-8">
          {app.coverImageUrl ? (
            <img
              src={`${API_URL}/uploads/${app.coverImageUrl}`}
              alt={app.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {app.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-500">{app.name}</p>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className={isApk ? 'badge badge-apk' : 'badge badge-exe'}>
              {app.fileType}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{app.name}</h1>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                {app.description || 'No description provided.'}
              </p>
            </div>

            {/* Video Section */}
            {app.videoUrl && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">How to Use</h2>
                <div className="rounded-xl overflow-hidden bg-black aspect-video">
                  <video
                    controls
                    className="w-full h-full"
                    src={`${API_URL}/uploads/${app.videoUrl}`}
                    ref={el => {
                      if (!el || !app.trimStart && !app.trimEnd) return;
                      const handleTime = () => {
                        if (app.trimEnd && el.currentTime >= app.trimEnd) {
                          el.pause();
                        }
                      };
                      el.addEventListener('timeupdate', handleTime);
                      if (app.trimStart) {
                        el.addEventListener('loadedmetadata', () => {
                          el.currentTime = app.trimStart!;
                        }, { once: true });
                      }
                    }}
                  >
                    Your browser does not support video playback.
                  </video>
                  {(app.trimStart || app.trimEnd) && (
                    <div className="px-3 py-1.5 bg-surface-light/80 border-t border-surface-border text-[11px] text-gray-500 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>
                        Trimmed: {app.trimStart?.toFixed(1)}s – {app.trimEnd?.toFixed(1)}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right - Sidebar */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              {/* Download Button */}
              <a
                href={api.apps.downloadUrl(app.id)}
                className="btn-primary w-full py-3 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download {app.fileType}
              </a>

              {/* Quick Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">File Size</span>
                  <span className="text-gray-300 font-medium">{formatSize(app.fileSize)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Downloads</span>
                  <span className="text-gray-300 font-medium">{app.downloads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className={`font-medium ${isApk ? 'text-cyan-400' : 'text-purple-400'}`}>
                    {app.fileType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Publisher</span>
                  <span className="text-gray-300">{app.user?.username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Published</span>
                  <span className="text-gray-300">{formatDate(app.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {user && (user.id === app.userId || user.role === 'admin' || user.role === 'superadmin') && (
              <div className="card p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Admin</h3>
                <button
                  onClick={async () => {
                    if (!confirm('Delete this app permanently?')) return;
                    try {
                      await api.apps.delete(app.id);
                      router.push('/dashboard');
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
                  className="btn-danger w-full text-sm"
                >
                  Delete App
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
