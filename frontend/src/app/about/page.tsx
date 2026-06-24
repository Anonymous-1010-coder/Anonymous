'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            About <span className="gradient-text">Anonymous</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Premium app marketplace — discover and download the best applications and system setups.
          </p>
        </div>

        <div className="space-y-8">
          <div className="card p-8">
            <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              Anonymous provides a curated marketplace for premium applications and system setups.
              We carefully select and verify every upload to ensure you get the best software
              experience possible. From productivity tools to entertainment, find everything
              you need in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Curated Quality</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Every app is reviewed and verified before being made available to download.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Fast Downloads</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Optimized servers ensure quick and reliable downloads every time.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Secure &amp; Safe</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                All files are scanned and verified for safety before publication.
              </p>
            </div>

            <div className="card p-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">All Formats</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Support for APK and EXE formats, with detailed guides for each.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
