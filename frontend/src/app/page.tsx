'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AppCard from '@/components/AppCard';
import { api } from '@/lib/api';
import { App } from '@/types';

export default function HomePage() {
  const [featured, setFeatured] = useState<App[]>([]);
  const [recent, setRecent] = useState<App[]>([]);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ apps: '--', downloads: '--', types: 'APK + EXE' });

  useEffect(() => {
    Promise.all([
      api.apps.featured(),
      api.apps.list({ limit: 12 }),
    ]).then(([featuredData, recentData]) => {
      setFeatured(featuredData);
      setRecent(recentData.apps);
      if (recentData.pagination) {
        setStats({
          apps: String(recentData.pagination.total || '--'),
          downloads: featuredData.reduce?.((s: number, a: App) => s + (a.downloads || 0), 0) || '--',
          types: 'APK + EXE',
        });
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/dashboard?search=${encodeURIComponent(search)}&type=${searchType}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-surface-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Premium App Marketplace
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Discover Premium{' '}
              <span className="gradient-text">Apps &amp; Tools</span>
            </h1>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              Curated collection of premium applications and system setups.
              Download the best software, all in one place.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 mb-8">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search apps..."
                className="input-field flex-1"
              />
              <select
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                className="input-field w-28 text-sm"
              >
                <option value="">All types</option>
                <option value="APK">.APK</option>
                <option value="EXE">.EXE</option>
              </select>
              <button type="submit" className="btn-primary px-5">
                Search
              </button>
            </form>

            <div className="flex gap-3 justify-center">
              <Link href="/dashboard" className="btn-primary">
                Browse Apps
              </Link>
              <Link href="/docs" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Apps */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Featured Apps</h2>
                <p className="section-subtitle mt-1">Most downloaded applications</p>
              </div>
              <Link href="/dashboard" className="text-sm text-primary hover:text-primary-hover transition-colors">
                View all &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Recent Apps */}
      <section className="border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Recent Uploads</h2>
                <p className="section-subtitle mt-1">Latest additions to the marketplace</p>
              </div>
              <Link href="/dashboard" className="text-sm text-primary hover:text-primary-hover transition-colors">
                View all &rarr;
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
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
            ) : recent.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No apps available yet</p>
                <p className="text-gray-600 text-sm mt-1">Check back soon for new additions.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recent.map((app, i) => (
                  <AppCard key={app.id} app={app} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-surface-border bg-surface-light/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-3 gap-8">
            {[
              { label: 'Total Apps', value: stats.apps, color: '#7c3aed' },
              { label: 'Total Downloads', value: String(stats.downloads), color: '#6366f1' },
              { label: 'File Types', value: stats.types, color: '#06b6d4' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-extrabold mb-2" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
