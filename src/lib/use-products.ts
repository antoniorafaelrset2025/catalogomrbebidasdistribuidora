'use client';

import { useEffect, useState } from 'react';
import { collection, doc, writeBatch, getDocs, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { products as staticProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

let seedingCheckCompleted = false;

async function seedDatabaseIfEmpty(firestore: Firestore) {
  if (seedingCheckCompleted) return;

  const productsCollectionRef = collection(firestore, 'products');
  
  try {
    const snapshot = await getDocs(productsCollectionRef);
    if (snapshot.empty) {
        console.log('Products collection is empty. Seeding database...');
        const batch = writeBatch(firestore);
        staticProducts.forEach((product) => {
            const docRef = doc(productsCollectionRef, product.id);
            batch.set(docRef, product);
        });
        
        await batch.commit();
        console.log('Database seeded successfully with initial products!');
    } else {
        console.log('Products collection already has data. Skipping seed.');
    }
    seedingCheckCompleted = true;

  } catch (error) {
    // This might fail due to permissions, which is okay for non-authed users.
    // The static list will be used as a fallback.
    console.warn("Could not check or seed database (this is expected on first load without auth):", error);
    seedingCheckCompleted = true; // Mark as checked even if it fails to prevent retries
  }
}

export function useProducts() {
  const firestore = useFirestore();
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    if (firestore && !seedingCheckCompleted) {
      seedDatabaseIfEmpty(firestore);
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
  const products = firestoreProducts && firestoreProducts.length > 0 ? firestoreProducts : staticProducts;
  const isLoading = initialLoading && isFirestoreLoading;

  return { products, isLoading, error };
}
