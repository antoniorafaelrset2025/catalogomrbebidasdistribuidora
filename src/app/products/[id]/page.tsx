import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-accent-foreground bg-accent/80 inline-block px-3 py-1 rounded-full mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
                {product.name}
              </h1>
            </div>

            <p className="text-3xl font-semibold">
                {product.price > 0 ? `R$${product.price.toFixed(2)}` : 'Preço sob consulta'}
            </p>

            <Separator />

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Descrição</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Button size="lg" className="w-full text-lg py-7">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
