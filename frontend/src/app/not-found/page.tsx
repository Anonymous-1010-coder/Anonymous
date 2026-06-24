'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-white">?</span>
          </div>

          <h1 className="text-8xl font-extrabold text-white mb-2">404</h1>
          <p className="text-xl text-gray-400 mb-8">Page not found</p>

          <div className="card p-6 max-w-md mx-auto mb-8">
            <p className="text-sm text-gray-500">
              The page you are looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
            <Link href="/dashboard" className="btn-secondary">
              Browse Apps
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
