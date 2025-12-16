'use client';

import { useEffect, useState } from 'react';
import { collection, doc, writeBatch, getDocs, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { products as staticProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

let isSeeding = false;
let seedingCompleted = false;

async function seedDatabase(firestore: Firestore) {
  if (isSeeding || seedingCompleted) return;

  isSeeding = true;
  const productsCollectionRef = collection(firestore, 'products');
  
  try {
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
      seedingCompleted = true;
    } else {
      seedingCompleted = true;
    }
  } catch (error) {
    // This might fail due to permissions, which is okay for non-authed users.
    // The static list will be used as a fallback.
    console.warn("Could not seed database (this is expected on first load without auth):", error);
  } finally {
    isSeeding = false;
  }
}

export function useProducts() {
  const firestore = useFirestore();
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    if (firestore && !seedingCompleted) {
      seedDatabase(firestore);
    }
  }, [firestore]);

  const productsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'products');
  }, [firestore]);


  const { data: firestoreProducts, isLoading: isFirestoreLoading, error } = useCollection<Product>(productsQuery);

  useEffect(() => {
    if(!isFirestoreLoading) {
      setInitialLoading(false);
    }
  }, [isFirestoreLoading]);

  // Use firestore products if available, otherwise fallback to static products.
  // This ensures that products are always displayed, even before Firestore has loaded
  // or if the user is offline.
  const products = firestoreProducts && firestoreProducts.length > 0 ? firestoreProducts : staticProducts;
  const isLoading = initialLoading && isFirestoreLoading;

  return { products, isLoading, error };
}
