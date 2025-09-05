import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-8 h-8', className)}
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="url(#logoGradient)"/>
      <rect x="8" y="10" width="16" height="14" rx="2" fill="white"/>
      <rect x="8" y="8" width="16" height="4" rx="2" fill="white"/>
      <circle cx="11" cy="10" r="0.8" fill="#6366f1"/>
      <circle cx="14" cy="10" r="0.8" fill="#6366f1"/>
      <circle cx="17" cy="10" r="0.8" fill="#6366f1"/>
      <circle cx="20" cy="10" r="0.8" fill="#6366f1"/>
      <line x1="8" y1="14" x2="24" y2="14" stroke="#e5e7eb" strokeWidth="0.5"/>
      <line x1="8" y1="18" x2="24" y2="18" stroke="#e5e7eb" strokeWidth="0.5"/>
      <line x1="8" y1="22" x2="24" y2="22" stroke="#e5e7eb" strokeWidth="0.5"/>
      <line x1="12" y1="12" x2="12" y2="24" stroke="#e5e7eb" strokeWidth="0.5"/>
      <line x1="16" y1="12" x2="16" y2="24" stroke="#e5e7eb" strokeWidth="0.5"/>
      <line x1="20" y1="12" x2="20" y2="24" stroke="#e5e7eb" strokeWidth="0.5"/>
      <circle cx="10" cy="16" r="1" fill="#ef4444"/>
      <circle cx="14" cy="20" r="1" fill="#10b981"/>
      <circle cx="18" cy="16" r="1" fill="#f59e0b"/>
      <g transform="translate(22, 6)">
        <line x1="3" y1="3" x2="5" y2="1" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <line x1="3" y1="3" x2="1" y2="5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <line x1="3" y1="3" x2="5" y2="5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <line x1="3" y1="3" x2="1" y2="1" stroke="white" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="3" cy="3" r="1" fill="white"/>
      </g>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
        </linearGradient>
      </defs>
    </svg>
  );
}
