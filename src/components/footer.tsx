
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from './theme-toggle';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Eventola — powered by Appwrite.
          </p>
        </div>
        <div className="flex gap-4 items-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="#" className="hover:text-primary">GitHub</Link>
        </div>
         <div className="flex items-center gap-4">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Eventola.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
