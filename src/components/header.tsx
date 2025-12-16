import Link from 'next/link';
import { ShoppingCart, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-auto">
          <Store className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">
            Online Showcase
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
