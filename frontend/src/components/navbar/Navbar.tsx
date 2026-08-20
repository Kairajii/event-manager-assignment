import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-foreground flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg">
            <CalendarDays className="h-5 w-5" />
          </div>

          <span>Event Manager</span>
        </Link>

      </div>
    </header>
  );
}
