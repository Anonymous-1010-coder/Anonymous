'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AppCard from '@/components/AppCard';
import { useAuth } from '@/app/layout';
import { api } from '@/lib/api';
import { App, Pagination } from '@/types';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [apps, setApps] = useState<App[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [tab, setTab] = useState<'browse' | 'mine'>('browse');

  const fetchApps = useCallback(async () => {
    setFetching(true);
    try {
      if (tab === 'mine' && user) {
        const data = await api.apps.my();
        setApps(data);
        setPagination(null);
      } else {
        const data = await api.apps.list({ search: search || undefined, type: type || undefined, page });
        setApps(data.apps);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, [tab, search, type, page, user]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
  }, [searchParams]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this app?')) return;
    try {
      await api.apps.delete(id);
      setApps(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">App Library</h1>
            <p className="section-subtitle mt-1">Browse and download applications</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setTab('browse'); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === 'browse'
                  ? 'bg-primary text-white'
                  : 'bg-surface-card text-gray-400 border border-surface-border hover:border-primary/30'
              }`}
            >
              Browse
            </button>
            {user && (
              <button
                onClick={() => { setTab('mine'); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === 'mine'
                    ? 'bg-primary text-white'
                    : 'bg-surface-card text-gray-400 border border-surface-border hover:border-primary/30'
                }`}
              >
                My Uploads
              </button>
            )}
          </div>
        </div>

        {/* Search / Filter */}
        {tab === 'browse' && (
          <form
            onSubmit={e => { e.preventDefault(); setPage(1); fetchApps(); }}
            className="flex gap-3 mb-8"
          >
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search apps by name or description..."
                className="input-field pl-10"
              />
            </div>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field w-32">
              <option value="">All types</option>
              <option value="APK">.APK</option>
              <option value="EXE">.EXE</option>
            </select>
            <button type="submit" className="btn-primary px-5">Search</button>
          </form>
        )}

        {/* Apps Grid */}
        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-36 rounded-none" />
                <div className="p-4">
                  <div className="skeleton h-4 w-16 mb-3" />
                  <div className="skeleton h-5 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-full mb-1" />
                  <div className="skeleton h-3 w-2/3 mb-4" />
                  <div className="skeleton h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">
              {tab === 'mine' ? 'You haven\'t uploaded any apps yet' : 'No apps found'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {tab === 'mine' ? 'Upload your first app to get started.' : 'Try adjusting your search or filter.'}
            </p>
            {tab === 'mine' && (
              <button onClick={() => router.push('/upload')} className="btn-primary mt-6">
                Upload App
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {apps.map((app, i) => (
                <AppCard
                  key={app.id}
                  app={app}
                  index={i}
                  showDelete={tab === 'mine' || user?.role === 'admin' || user?.role === 'superadmin'}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10 pt-6 border-t border-surface-border">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-sm py-2 px-4 disabled:opacity-30"
                >
                  &larr; Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === p
                          ? 'bg-primary text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="btn-secondary text-sm py-2 px-4 disabled:opacity-30"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
