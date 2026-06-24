import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ showText = true, size = 'sm' }: LogoProps) {
  const iconSize = size === 'lg' ? 40 : size === 'md' ? 32 : 24;

  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="48" height="48" rx="12" fill="url(#logoGrad)" />
        <text x="32" y="44" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" fontFamily="system-ui">
          A
        </text>
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-white group-hover:text-primary transition-colors ${
            size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'
          }`}>
            Anonymous
          </span>
          <span className="text-[10px] text-gray-500 -mt-0.5">
            App Marketplace
          </span>
        </div>
      )}
    </Link>
  );
}
