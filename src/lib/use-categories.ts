
'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, doc, writeBatch, getDocs, Firestore, query, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Category } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';
import { categories as staticCategories } from '@/lib/products'; 

let seedingChecked = false;

async function seedDatabaseIfEmpty(firestore: Firestore) {
  if (seedingChecked) {
    return;
  }
  seedingChecked = true;
  const categoriesCollectionRef = collection(firestore, 'categories');
  
  try {
    const snapshot = await getDocs(categoriesCollectionRef);
    if (snapshot.empty) {
        console.log('Categories collection is empty. Seeding database...');
        const batch = writeBatch(firestore);
        staticCategories.forEach((categoryName) => {
            const docRef = doc(categoriesCollectionRef); // Auto-generate ID
            batch.set(docRef, { name: categoryName });
        });
        
        await batch.commit();
        console.log('Database seeded successfully with initial categories!');
    } else {
        console.log('Categories collection already has data. Skipping seed.');
    }

  } catch (error) {
    console.warn("Could not check or seed categories collection:", error);
  }
}

export function useCategories() {
  const firestore = useFirestore();
  const [key, setKey] = useState(0); // State to force re-render
  
  useEffect(() => {
    if (firestore) {
      seedDatabaseIfEmpty(firestore);
    }
  }, [firestore]);

  const categoriesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      // Order categories by name for consistent display
      return query(collection(firestore, 'categories'), orderBy('name'));
  }, [firestore, key]);


  const { data: firestoreCategories, isLoading, error } = useCollection<Omit<Category, 'id'>>(categoriesQuery);

  const refreshCategories = useCallback(() => {
    // Changing the key will re-create the query and trigger useCollection to refetch.
    setKey(prevKey => prevKey + 1);
  }, []);

  const categories: Category[] | null = firestoreCategories ? firestoreCategories.map(c => ({...c, name: c.name as string})) : null;
  
  return { categories, isLoading, error, refreshCategories };
}

    