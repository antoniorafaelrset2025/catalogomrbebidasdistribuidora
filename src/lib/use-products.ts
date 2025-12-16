'use client';

import { useEffect } from 'react';
import { collection, doc, writeBatch, getDocs, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { products as staticProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

async function seedDatabase(firestore: Firestore) {
  const productsCollectionRef = collection(firestore, 'products');
  const snapshot = await getDocs(productsCollectionRef);
  
  if (snapshot.empty) {
    console.log('Database is empty. Seeding with initial products...');
    const batch = writeBatch(firestore);
    staticProducts.forEach((product) => {
      const docRef = doc(productsCollectionRef, product.id);
      batch.set(docRef, product);
    });
    await batch.commit();
    console.log('Database seeded successfully!');
  } else {
    console.log('Database already has products. Skipping seed.');
  }
}

export function useProducts() {
  const firestore = useFirestore();
  
  useEffect(() => {
    if (firestore) {
      seedDatabase(firestore);
    }
  }, [firestore]);

  const productsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'products');
  }, [firestore]);


  const { data: products, isLoading, error } = useCollection<Product>(productsQuery);

  return { products, isLoading, error };
}
