import Link from 'next/link';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ProductListItemProps = {
  product: Product;
};

export default function ProductListItem({ product }: ProductListItemProps) {
  return (
    <Card className="transition-all duration-300 border hover:shadow-lg hover:border-accent">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle>
              <Link
                href={`/products/${product.id}`}
                className="hover:underline"
              >
                {product.name}
              </Link>
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {product.description}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold whitespace-nowrap">
              ${product.price.toFixed(2)}
            </p>
            <Button variant="secondary" size="sm" asChild className="mt-2">
              <Link href={`/products/${product.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
