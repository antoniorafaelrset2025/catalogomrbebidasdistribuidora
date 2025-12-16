"use client";

import { useState, useMemo } from 'react';
import { products, categories as allCategories } from '@/lib/products';
import type { Product, Category } from '@/lib/types';
import ProductListItem from '@/components/product-list-item';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ["Todos os Produtos", "Cigarros Sousa Cruz", "Cigarros Nacional", "Fumos", "Sedas", "Isqueiros", "Long Necks", "Cervejas"];
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos os Produtos');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const productCategory = product.category;
      
      let matchesCategory = false;
      if (selectedCategory === 'Todos os Produtos') {
        matchesCategory = true;
      } else if (selectedCategory === 'Cigarros Sousa Cruz' && productCategory === 'Electronics') {
        matchesCategory = true;
      } else if (selectedCategory === 'Cigarros Nacional' && productCategory === 'Office') {
        matchesCategory = true;
      } else if (selectedCategory === 'Fumos' && productCategory === 'Lighting') {
        matchesCategory = true;
      }
      else if (selectedCategory === 'Sedas' && product.name.toLowerCase().includes('stand')) {
          matchesCategory = true;
      } else if (selectedCategory === 'Isqueiros' && product.name.toLowerCase().includes('lamp')) {
          matchesCategory = true;
      } else if (selectedCategory === 'Long Necks' && product.name.toLowerCase().includes('desk')) {
          matchesCategory = true;
      } else if (selectedCategory === 'Cervejas' && product.name.toLowerCase().includes('hub')) {
          matchesCategory = true;
      }


      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <div className="relative text-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80 via-background/90">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-primary rounded-full p-2 w-32 h-32 flex items-center justify-center">
              <div className="bg-black rounded-full w-full h-full flex items-center justify-center">
                 <span className="text-primary text-5xl font-black">MR</span>
              </div>
            </div>
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
        <div className="bg-card p-4 rounded-lg border shadow-lg sticky top-20 z-40">
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
                <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                </Button>
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
          {filteredProducts.length > 0 ? (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-card rounded-lg border mt-8">
              <h3 className="text-2xl font-semibold">Nenhum produto encontrado</h3>
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
