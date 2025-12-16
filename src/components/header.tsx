import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="absolute top-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" asChild>
            <Link href="#">
              <LogIn className="mr-2" />
              Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
