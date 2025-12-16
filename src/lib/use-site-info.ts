
'use client';

import { useEffect, useState } from 'react';
import { doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import type { SiteInfo } from '@/lib/types';
import { useMemoFirebase } from '@/firebase/provider';

const SITE_INFO_DOC_ID = 'main';

const defaultSiteInfo: SiteInfo = {
    siteName: 'MR Bebidas',
    heroTitle1: 'MR BEBIDAS',
    heroTitle2: 'DISTRIBUIDORA',
    heroLocation: 'FORTALEZA',
    heroSlogan: 'Explore nossa seleção completa de tabacaria e bebidas premium',
    heroPhone: '5585992234683',
    heroPhoneDisplay: '(85) 99223-4683',
    heroLocation2: 'CUMBUCO',
    heroPhone2: '5585994125603',
    heroPhoneDisplay2: '(85) 99412-5603',
};

let seedingCheckCompleted = false;

async function seedSiteInfoIfEmpty(firestore: Firestore) {
  if (seedingCheckCompleted) return;

  const siteInfoRef = doc(firestore, 'siteInfo', SITE_INFO_DOC_ID);
  
  try {
    const docSnap = await getDoc(siteInfoRef);
    if (!docSnap.exists()) {
        console.log('Site info document does not exist. Seeding with default data...');
        await setDoc(siteInfoRef, defaultSiteInfo);
        console.log('Site info seeded successfully!');
    } else {
        // If the document exists, we can still merge to add new fields from defaultSiteInfo
        // that might not be in the database yet from previous versions.
        await setDoc(siteInfoRef, defaultSiteInfo, { merge: true });
        console.log('Site info document exists. Ensured all fields are present.');
    }
    seedingCheckCompleted = true;
  } catch (error) {
    console.warn("Could not check or seed site info (this is expected on first load without auth):", error);
    seedingCheckCompleted = true; // Mark as checked to prevent retries
  }
}

export function useSiteInfo() {
  const firestore = useFirestore();
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    if (firestore && !seedingCheckCompleted) {
      seedSiteInfoIfEmpty(firestore);
    }
  }, [firestore]);

  const siteInfoRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return doc(firestore, 'siteInfo', SITE_INFO_DOC_ID);
  }, [firestore]);


  const { data: firestoreInfo, isLoading: isFirestoreLoading, error } = useDoc<SiteInfo>(siteInfoRef);
  
  useEffect(() => {
    if(!isFirestoreLoading) {
      setInitialLoading(false);
    }
  }, [isFirestoreLoading]);

  // Use firestore info if available, otherwise fallback to static default.
  // We also merge to ensure all fields are present even if the DB doc is partial.
  const siteInfo = firestoreInfo 
    ? { ...defaultSiteInfo, ...firestoreInfo } 
    : defaultSiteInfo;
    
  const isLoading = initialLoading && isFirestoreLoading;

  return { siteInfo, isLoading, error, siteInfoRef };
}
