'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { useDoc, useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Edit, Save, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMemoFirebase } from '@/firebase/provider';

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductPage({ params: paramsPromise }: ProductPageProps) {
  const params = use(paramsPromise);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [newPrice, setNewPrice] = useState<number | string>('');

  const productRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'products', params.id);
  }, [firestore, params.id]);

  const { data: product, isLoading } = useDoc<Product>(productRef);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-10 w-1/3" />
          <Separator />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }
  
  const handlePriceUpdate = async () => {
    if (typeof newPrice !== 'number' || newPrice < 0) {
      toast({
        variant: 'destructive',
        title: 'Preço inválido',
        description: 'Por favor, insira um número válido.',
      });
      return;
    }
    if (productRef) {
      const updatedData = { price: newPrice };
      updateDoc(productRef, updatedData)
        .then(() => {
          toast({
            title: 'Sucesso!',
            description: 'O preço foi atualizado.',
          });
          setIsEditing(false);
        })
        .catch(() => {
            const permissionError = new FirestorePermissionError({
              path: productRef.path,
              operation: 'update',
              requestResourceData: updatedData,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
  };


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

            <div className="flex items-center gap-4">
              {isEditing && user ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                      className="text-3xl font-semibold w-48"
                      placeholder={product.price > 0 ? product.price.toFixed(2) : '0.00'}
                    />
                    <Button onClick={handlePriceUpdate} size="icon"><Save /></Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="icon">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
              ) : (
                <p className="text-3xl font-semibold">
                  {product.price > 0
                    ? `R$${product.price.toFixed(2)}`
                    : 'Consulte'}
                </p>
              )}
               {user && !isEditing && (
                <Button onClick={() => {
                  setIsEditing(true);
                  setNewPrice(product.price > 0 ? product.price : '');
                }} variant="outline" size="icon">
                  <Edit className="w-5 h-5"/>
                </Button>
              )}
            </div>

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
