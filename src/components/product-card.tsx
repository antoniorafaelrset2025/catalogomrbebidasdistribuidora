import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 border hover:shadow-accent/20 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full overflow-hidden">
            {product.images[0] && (
              <Image
                src={product.images[0].imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.images[0].imageHint}
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <CardTitle className="text-lg font-semibold leading-tight mb-2">
            {product.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-xl font-bold">
            ${product.price.toFixed(2)}
          </p>
          <Button variant="secondary" size="sm" asChild>
            <span className="cursor-pointer">View Details</span>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
