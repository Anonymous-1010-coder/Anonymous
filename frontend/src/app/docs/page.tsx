'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Documentation
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Learn how to use the Anonymous marketplace — from browsing to downloading.
          </p>
        </div>

        <div className="space-y-8">
          <div className="card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Getting Started</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">01</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Browse the Library</h3>
                  <p className="text-sm text-gray-400">Explore the dashboard to find apps. Use the search bar to find specific apps or filter by type (APK/EXE).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">02</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">View App Details</h3>
                  <p className="text-sm text-gray-400">Click on any app to see its description, screenshots, tutorial video, and system requirements.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">03</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">Download &amp; Install</h3>
                  <p className="text-sm text-gray-400">Click the download button to get your file. For APK files, enable "Unknown Sources" on your Android device. For EXE files, run the installer.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-white mb-6">Supported Formats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface-light/50 border border-surface-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-cyan-400">APK</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Android Package Kit</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">For Android devices and emulators. Side-load by enabling installation from unknown sources.</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-light/50 border border-surface-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-400">EXE</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Windows Executable</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">For Windows desktop applications. Run the installer or portable executable directly.</p>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard" className="btn-primary text-sm">
                Browse Apps
              </Link>
              <Link href="/about" className="btn-secondary text-sm">
                About Anonymous
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
