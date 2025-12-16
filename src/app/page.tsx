'use client';

import { useState, useMemo } from 'react';
import type { Product, Category, SiteInfo } from '@/lib/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Edit, Save, X, Phone, PlusCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useProducts } from '@/lib/use-products';
import { useSiteInfo } from '@/lib/use-site-info';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';
import { AddProductDialog } from '@/components/add-product-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


type EditableField = 'siteName' | 'heroTitle1' | 'heroTitle2' | 'heroLocation' | 'heroPhoneDisplay' | 'heroLocation2' | 'heroPhoneDisplay2';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, isLoading: areProductsLoading, refreshProducts } = useProducts();
  const { siteInfo, isLoading: isSiteInfoLoading, siteInfoRef, refreshSiteInfo } = useSiteInfo();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number | string>('');
  const [newName, setNewName] = useState<string>('');
  
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [fieldValue, setFieldValue] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const isLoading = areProductsLoading || isSiteInfoLoading;

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

  const handleUpdateProduct = async (productId: string, data: Partial<Product>) => {
    if (firestore) {
      const productRef = doc(firestore, 'products', productId);
      updateDoc(productRef, data)
        .then(() => {
          toast({
            title: 'Sucesso!',
            description: 'O produto foi atualizado.',
          });
          setEditingProductId(null);
          refreshProducts();
        })
        .catch(() => {
          const permissionError = new FirestorePermissionError({
            path: productRef.path,
            operation: 'update',
            requestResourceData: data,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  };
  
  const handleDeleteProduct = async () => {
    if (firestore && productToDelete) {
      const productRef = doc(firestore, 'products', productToDelete.id);
      deleteDoc(productRef)
        .then(() => {
          toast({
            title: 'Sucesso!',
            description: 'O produto foi excluído.',
          });
          setProductToDelete(null);
          refreshProducts();
        })
        .catch(() => {
          const permissionError = new FirestorePermissionError({
            path: productRef.path,
            operation: 'delete',
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  };

  const handleUpdateSiteInfo = async () => {
    if (firestore && editingField && siteInfoRef) {
      const data: Partial<SiteInfo> = { [editingField]: fieldValue };

      if (editingField === 'heroPhoneDisplay') {
        data.heroPhone = fieldValue.replace(/\D/g, '');
      }
      
      if (editingField === 'heroPhoneDisplay2') {
        data.heroPhone2 = fieldValue.replace(/\D/g, '');
      }

      updateDoc(siteInfoRef, data)
        .then(() => {
          toast({
            title: 'Sucesso!',
            description: 'A informação do site foi atualizada.',
          });
          setEditingField(null);
          setFieldValue('');
          refreshSiteInfo();
        })
        .catch(() => {
          const permissionError = new FirestorePermissionError({
            path: siteInfoRef.path,
            operation: 'update',
            requestResourceData: data,
          });
          errorEmitter.emit('permission-error', permissionError);
        });
    }
  };

  const handleStartEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setNewPrice(product.price > 0 ? product.price : '');
    setNewName(product.name);
  };
  
  const handleStartEditingField = (field: EditableField, currentValue: string) => {
    setEditingField(field);
    setFieldValue(currentValue);
  };

  const handleCancelEditing = () => {
    setEditingProductId(null);
    setNewPrice('');
    setNewName('');
    setEditingField(null);
    setFieldValue('');
  };
  
  const renderEditableField = (field: EditableField, value: string, className: string) => {
    if (editingField === field && user) {
      return (
         <div className="flex justify-center items-center gap-2">
            <Input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className={`${className} h-auto p-0 border-dashed text-center`}
            />
            <Button onClick={handleUpdateSiteInfo} size="icon" className="h-9 w-9"><Save className="w-5 h-5"/></Button>
            <Button onClick={handleCancelEditing} variant="ghost" size="icon" className="h-9 w-9">
              <X className="w-5 h-5" />
            </Button>
          </div>
      )
    }
    
    return (
      <div className="flex justify-center items-center gap-2 group">
        <span className={className}>{value}</span>
        {user && (
          <Button onClick={() => handleStartEditingField(field, value)} variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100">
             <Edit className="w-5 h-5"/>
          </Button>
        )}
      </div>
    )
  }

  const WhatsappIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-green-500"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.89-5.466 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.081l-1.214 4.439 4.542-1.195z" />
    </svg>
  );

  return (
    <>
      <div className="relative text-center pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="flex justify-center items-center mb-4 pt-4">
            <Image
              src="/logo.png"
              alt="MR Bebidas Distribuidora Logo"
              width={160}
              height={160}
              className="rounded-full"
            />
          </div>
          {isSiteInfoLoading ? <Skeleton className="h-16 w-1/2 mx-auto" /> : renderEditableField('heroTitle1', siteInfo.heroTitle1, 'text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl text-foreground')}
          {isSiteInfoLoading ? <Skeleton className="h-14 w-3/4 mx-auto mt-2" /> : renderEditableField('heroTitle2', siteInfo.heroTitle2, 'text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground')}
          
          <div className="mt-4 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  {isSiteInfoLoading ? <Skeleton className="h-5 w-24" /> : (
                    <div className="group flex items-center justify-center">
                      {editingField === 'heroLocation' && user ? (
                          <div className="flex justify-center items-center gap-2">
                              <Input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => setFieldValue(e.target.value)}
                                className="text-muted-foreground font-semibold h-auto p-0 border-dashed text-center"
                              />
                              <Button onClick={handleUpdateSiteInfo} size="icon" className="h-8 w-8"><Save className="w-4 h-4"/></Button>
                              <Button onClick={handleCancelEditing} variant="ghost" size="icon" className="h-8 w-8">
                                <X className="w-4 h-4" />
                              </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-muted-foreground font-semibold">{siteInfo.heroLocation}</p>
                            {user && (
                                <Button onClick={() => handleStartEditingField('heroLocation', siteInfo.heroLocation)} variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100">
                                    <Edit className="w-4 h-4"/>
                                </Button>
                            )}
                          </>
                        )
                      }
                    </div>
                  )}
              </div>
               <div className="flex items-center gap-2 group">
                {isSiteInfoLoading ? <Skeleton className="h-5 w-32" /> : (
                  <>
                    {editingField === 'heroPhoneDisplay' && user ? (
                      <div className="flex justify-center items-center gap-2">
                          <Input
                            type="text"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                            className="text-muted-foreground font-semibold h-auto p-0 border-dashed text-center"
                          />
                          <Button onClick={handleUpdateSiteInfo} size="icon" className="h-8 w-8"><Save className="w-4 h-4"/></Button>
                          <Button onClick={handleCancelEditing} variant="ghost" size="icon" className="h-8 w-8">
                            <X className="w-4 h-4" />
                          </Button>
                      </div>
                    ) : (
                      <>
                        <a href={`https://wa.me/${siteInfo.heroPhone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                          <WhatsappIcon />
                          <p className="text-muted-foreground font-semibold group-hover:underline">{siteInfo.heroPhoneDisplay}</p>
                        </a>
                        {user && (
                          <Button onClick={() => handleStartEditingField('heroPhoneDisplay', siteInfo.heroPhoneDisplay)} variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100">
                              <Edit className="w-4 h-4"/>
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}
               </div>
            </div>
             <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  {isSiteInfoLoading ? <Skeleton className="h-5 w-24" /> : (
                    <div className="group flex items-center justify-center">
                      {editingField === 'heroLocation2' && user ? (
                          <div className="flex justify-center items-center gap-2">
                              <Input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => setFieldValue(e.target.value)}
                                className="text-muted-foreground font-semibold h-auto p-0 border-dashed text-center"
                              />
                              <Button onClick={handleUpdateSiteInfo} size="icon" className="h-8 w-8"><Save className="w-4 h-4"/></Button>
                              <Button onClick={handleCancelEditing} variant="ghost" size="icon" className="h-8 w-8">
                                <X className="w-4 h-4" />
                              </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-muted-foreground font-semibold">{siteInfo.heroLocation2}</p>
                            {user && (
                                <Button onClick={() => handleStartEditingField('heroLocation2', siteInfo.heroLocation2)} variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100">
                                    <Edit className="w-4 h-4"/>
                                </Button>
                            )}
                          </>
                        )
                      }
                    </div>
                  )}
              </div>
               <div className="flex items-center gap-2 group">
                {isSiteInfoLoading ? <Skeleton className="h-5 w-32" /> : (
                  <>
                    {editingField === 'heroPhoneDisplay2' && user ? (
                      <div className="flex justify-center items-center gap-2">
                          <Input
                            type="text"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                            className="text-muted-foreground font-semibold h-auto p-0 border-dashed text-center"
                          />
                          <Button onClick={handleUpdateSiteInfo} size="icon" className="h-8 w-8"><Save className="w-4 h-4"/></Button>
                          <Button onClick={handleCancelEditing} variant="ghost" size="icon" className="h-8 w-8">
                            <X className="w-4 h-4" />
                          </Button>
                      </div>
                    ) : (
                      <>
                        <a href={`https://wa.me/${siteInfo.heroPhone2}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
                          <WhatsappIcon />
                          <p className="text-muted-foreground font-semibold group-hover:underline">{siteInfo.heroPhoneDisplay2}</p>
                        </a>
                        {user && (
                          <Button onClick={() => handleStartEditingField('heroPhoneDisplay2', siteInfo.heroPhoneDisplay2)} variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100">
                              <Edit className="w-4 h-4"/>
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}
               </div>
            </div>
          </div>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
             {isSiteInfoLoading ? <Skeleton className="h-6 w-full max-w-md mx-auto" /> : siteInfo.heroSlogan}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
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
             {user && (
              <Button onClick={() => setIsAddProductOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            )}
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
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        {editingProductId === product.id && user ? (
                           <Input
                             type="text"
                             value={newName}
                             onChange={(e) => setNewName(e.target.value)}
                             className="text-2xl font-semibold leading-none tracking-tight h-auto"
                           />
                        ) : (
                          <CardTitle>{product.name}</CardTitle>
                        )}
                      </div>
                      <div className="text-right flex items-center gap-2">
                         {editingProductId === product.id && user ? (
                            <div className="flex items-center gap-2">
                               <Input 
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                                className="w-32 text-base"
                                placeholder={product.price > 0 ? product.price.toFixed(2) : '0.00'}
                              />
                              <Button onClick={() => handleUpdateProduct(product.id, { name: newName, price: Number(newPrice) })} size="icon" className="h-9 w-9"><Save /></Button>
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
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onSelect={() => handleStartEditingProduct(product)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => setProductToDelete(product)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Excluir</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
      {user && (
        <AddProductDialog
            isOpen={isAddProductOpen}
            onOpenChange={setIsAddProductOpen}
            categories={categories.filter((c) => c !== 'Todos') as Category[]}
            onProductAdded={refreshProducts}
        />
      )}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá permanentemente o produto <strong>{productToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
