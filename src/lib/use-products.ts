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
  seedingCheckCompleted = true; // Set immediately to prevent multiple runs
  
  try {
    const snapshot = await getDocs(productsCollectionRef);
    if (snapshot.empty) {
        console.log('Products collection is empty. Seeding database...');
        const batch = writeBatch(firestore);
        staticProducts.forEach((product) => {
            const docData = {
                ...product,
                // Ensure there's a description, even if it's empty
                description: product.description || '' 
            };
            const docRef = doc(productsCollectionRef, product.id);
            batch.set(docRef, docData);
        });
        
        await batch.commit();
        console.log('Database seeded successfully with initial products!');
    } else {
        console.log('Products collection already has data. Skipping seed.');
    }

  } catch (error) {
    // This might fail due to permissions, which is okay for non-authed users.
    // The static list will be used as a fallback.
    console.warn("Could not check or seed database (this is expected on first load without auth):", error);
  }
}

export function useProducts() {
  const firestore = useFirestore();
  const [isSeeding, setIsSeeding] = useState(true);
  
  useEffect(() => {
    if (firestore && !seedingCheckCompleted) {
      seedDatabaseIfEmpty(firestore).finally(() => {
        setIsSeeding(false);
      });
    } else {
      setIsSeeding(false);
    }
  }, [firestore]);

  const productsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'products');
  }, [firestore]);


  const { data: firestoreProducts, isLoading: isFirestoreLoading, error } = useCollection<Product>(productsQuery);

  const isLoading = isSeeding || (firestoreProducts === null && isFirestoreLoading);

  // Use firestore products if available, otherwise fallback to static products.
  // This fallback is mostly for the brief moment before the first Firestore fetch.
  const products = firestoreProducts ?? staticProducts;
  
  return { products, isLoading, error };
}
