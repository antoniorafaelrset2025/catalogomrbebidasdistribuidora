'use client';

import { useEffect } from 'react';
import { collection, doc, writeBatch, getDocs, Firestore } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { products as staticProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

async function seedDatabase(firestore: Firestore) {
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
    } else {
      console.log('Database already has products. Skipping seed.');
    }
  } catch (error) {
    // If we get a permission error, it's likely because a non-authed user is trying to seed.
    // We can suppress this client-side error as seeding is an admin-like task.
    if (error instanceof FirestorePermissionError || (error as any).code === 'permission-denied') {
        console.warn('Permission denied to check or seed database. This is expected for non-authenticated users.');
    } else {
        console.error("Error seeding database:", error);
    }
  }
}

export function useProducts() {
  const firestore = useFirestore();
  const { user } = useUser();
  
  useEffect(() => {
    // Only attempt to seed if the user is authenticated.
    if (firestore && user) {
      seedDatabase(firestore);
    }
  }, [firestore, user]);

  const productsQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'products');
  }, [firestore]);


  const { data: products, isLoading, error } = useCollection<Product>(productsQuery);

  return { products, isLoading, error };
}
