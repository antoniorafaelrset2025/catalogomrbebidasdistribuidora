'use client';

import { useEffect } from 'react';
import { collection, doc, writeBatch, getDocs, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { products as staticProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

let seedingChecked = false;

async function seedDatabaseIfEmpty(firestore: Firestore) {
  if (seedingChecked) {
    return;
  }
  seedingChecked = true;
  const productsCollectionRef = collection(firestore, 'products');
  
  try {
    const snapshot = await getDocs(productsCollectionRef);
    if (snapshot.empty) {
        console.log('Products collection is empty. Seeding database...');
        const batch = writeBatch(firestore);
        staticProducts.forEach((product) => {
            const docData = {
                ...product,
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
    if (process.env.NODE_ENV === 'development') {
      console.log("Could not check or seed database (this is expected on first load without auth):", error);
    }
  }
}

export function useProducts() {
  const firestore = useFirestore();
  
  useEffect(() => {
    if (firestore) {
      seedDatabaseIfEmpty(firestore);
    }
  }, [firestore]);

  const productsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'products');
  }, [firestore]);


  const { data: firestoreProducts, isLoading: isFirestoreLoading, error } = useCollection<Product>(productsQuery);

  const products = firestoreProducts ?? [];
  
  return { products, isLoading: isFirestoreLoading, error };
}
