
'use client';

import { useEffect, useState } from 'react';
import { doc, setDoc, Firestore } from 'firebase/firestore';
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
};


let isSeeding = false;
let seedingCompleted = false;

async function seedSiteInfo(firestore: Firestore) {
  if (isSeeding || seedingCompleted) return;

  isSeeding = true;
  const siteInfoRef = doc(firestore, 'siteInfo', SITE_INFO_DOC_ID);
  
  try {
    // We use set with merge true to create the doc if it doesn't exist,
    // or update it with default values for any missing fields.
    await setDoc(siteInfoRef, defaultSiteInfo, { merge: true });
    console.log('Site info seeded/checked successfully!');
    seedingCompleted = true;
  } catch (error) {
    console.warn("Could not seed site info (this is expected on first load without auth):", error);
  } finally {
    isSeeding = false;
  }
}

export function useSiteInfo() {
  const firestore = useFirestore();
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    if (firestore && !seedingCompleted) {
      seedSiteInfo(firestore);
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
