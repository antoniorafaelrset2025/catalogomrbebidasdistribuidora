import Link from 'next/link';
import type { Product } from '@/lib/types';
import {
  Card,
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
    <Card className="transition-all duration-300 border hover:shadow-lg hover:border-primary">
      <CardHeader>
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <CardTitle>
              <Link
                href={`/products/${product.id}`}
                className="hover:underline"
              >
                {product.name}
              </Link>
            </CardTitle>
          </div>
          <div className="text-right flex items-center gap-4">
            <p className="text-xl font-bold whitespace-nowrap">
              ${product.price.toFixed(2)}
            </p>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/products/${product.id}`}>Ver Detalhes</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
