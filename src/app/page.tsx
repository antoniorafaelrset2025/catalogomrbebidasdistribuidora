'use client';

import { useState, useMemo } from 'react';
import type { Product, Category } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/lib/use-products';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';


export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, isLoading } = useProducts();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number | string>('');

  const categories: (Category | 'Todos')[] = [
    'Todos',
    'Cigarros Sousa Cruz',
    'Cigarros Nacional',
    'Fumos',
    'Seda',
    'Isqueiros',
    'BEBIDAS',
    'LONG NECKS',
    'CERVEJAS LATAS',
    'CACHAÇAS 1L',
    'CACHAÇAS MEIOTAS',
    'VODKAS',
    'GIN',
    'WHISKYS',
    'DESTILADOS',
    'VINHOS',
    'ENERGÉTICOS',
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handlePriceUpdate = async (productId: string) => {
    if (typeof newPrice !== 'number' || newPrice < 0) {
      toast({
        variant: 'destructive',
        title: 'Preço inválido',
        description: 'Por favor, insira um número válido.',
      });
      return;
    }
    if (firestore) {
      const productRef = doc(firestore, 'products', productId);
      const updatedData = { price: newPrice };
      updateDoc(productRef, updatedData)
        .then(() => {
          toast({
            title: 'Sucesso!',
            description: 'O preço foi atualizado.',
          });
          setEditingProductId(null);
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

  const handleStartEditing = (product: Product) => {
    setEditingProductId(product.id);
    setNewPrice(product.price > 0 ? product.price : '');
  };

  const handleCancelEditing = () => {
    setEditingProductId(null);
    setNewPrice('');
  };


  return (
    <>
      <div className="relative text-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80 via-background/90">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative">
          <div className="flex justify-center items-center mb-4">
            <Image
              src="/logo.png"
              alt="MR Bebidas Distribuidora Logo"
              width={128}
              height={128}
              className="rounded-full"
            />
          </div>
          <h1 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl text-foreground">
            MR BEBIDAS
          </h1>
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
            DISTRIBUIDORA
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <p className="text-muted-foreground font-semibold">FORTALEZA</p>
          </div>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore nossa seleção completa de tabacaria e bebidas premium
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16">
        <div className="bg-card p-4 rounded-lg border shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
             <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                     <Skeleton className="h-6 w-3/4" />
                     <Skeleton className="h-5 w-1/4 mt-2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="transition-all duration-300 border hover:shadow-lg hover:border-primary"
                >
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
                      <div className="text-right flex items-center gap-2">
                         {editingProductId === product.id && user ? (
                            <div className="flex items-center gap-2">
                              <Input 
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                                className="w-28 text-base"
                                placeholder={product.price > 0 ? product.price.toFixed(2) : '0.00'}
                                autoFocus
                              />
                              <Button onClick={() => handlePriceUpdate(product.id)} size="icon" className="h-9 w-9"><Save /></Button>
                              <Button onClick={handleCancelEditing} variant="ghost" size="icon" className="h-9 w-9">
                                <X className="w-5 h-5" />
                              </Button>
                            </div>
                        ) : (
                          <>
                            <p className="text-xl font-bold whitespace-nowrap">
                              {product.price > 0
                                ? `R$${product.price.toFixed(2)}`
                                : 'Consulte'}
                            </p>
                            {user && (
                              <Button onClick={() => handleStartEditing(product)} variant="outline" size="icon" className="h-9 w-9">
                                <Edit className="w-4 h-4"/>
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg border mt-8">
              <h3 className="text-2xl font-semibold">
                Nenhum produto encontrado
              </h3>
              <p className="mt-2 text-muted-foreground">
                Tente ajustar seus filtros.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
