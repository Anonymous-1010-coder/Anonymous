import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>&copy; {new Date().getFullYear()} Anonymous</span>
            <span className="text-gray-700">|</span>
            <span>v1.0.0</span>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600 text-center md:text-right">
              Premium app marketplace.
            </p>
            <Link
              href="/login"
              className="text-[10px] text-gray-800 hover:text-gray-600 transition-colors"
              title="Admin access"
            >
              ●
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
