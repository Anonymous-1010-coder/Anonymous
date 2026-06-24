'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
