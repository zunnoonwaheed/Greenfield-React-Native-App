/**
 * CreateAdContext - Shared state management for Create Ad flow
 * Maintains form data across all 3 steps
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for ad data
export interface AdData {
  // Step 1
  title: string;
  description: string;
  categoryId: number | null;
  categoryName: string;
  subcategory: string;
  condition: 'new' | 'used' | '';
  price: string;
  negotiable: boolean;

  // Step 2
  specifications: string[];
  images: string[];

  // Step 3
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
}

interface CreateAdContextType {
  adData: AdData;
  updateAdData: (data: Partial<AdData>) => void;
  resetAdData: () => void;
}

const initialAdData: AdData = {
  title: '',
  description: '',
  categoryId: null,
  categoryName: '',
  subcategory: '',
  condition: '',
  price: '',
  negotiable: false,
  specifications: [],
  images: ['', '', '', '', ''],
  fullName: '',
  phone: '',
  email: '',
  city: '',
  address: '',
};

const CreateAdContext = createContext<CreateAdContextType | undefined>(undefined);

export const CreateAdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adData, setAdData] = useState<AdData>(initialAdData);

  const updateAdData = (data: Partial<AdData>) => {
    setAdData((prev) => ({ ...prev, ...data }));
  };

  const resetAdData = () => {
    setAdData(initialAdData);
  };

  return (
    <CreateAdContext.Provider value={{ adData, updateAdData, resetAdData }}>
      {children}
    </CreateAdContext.Provider>
  );
};

export const useCreateAd = () => {
  const context = useContext(CreateAdContext);
  if (!context) {
    throw new Error('useCreateAd must be used within CreateAdProvider');
  }
  return context;
};
