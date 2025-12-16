import { products } from '@/lib/products';
import type { Category } from '@/lib/types';
import ProductCard from '@/components/product-card';

type SimilarProductsProps = {
  currentProductId: string;
  category: Category;
};

export default function SimilarProducts({
  currentProductId,
  category,
}: SimilarProductsProps) {
  const similar = products
    .filter((p) => p.category === category && p.id !== currentProductId)
    .slice(0, 3);

  if (similar.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {similar.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
