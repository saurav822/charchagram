'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { ConstituencyListType } from '@/types/constituency';
import { BiharId } from '@/constants/constants';

interface ConstituencyContextType {
  constituencyAreaList: ConstituencyListType[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const ConstituencyContext = createContext<ConstituencyContextType | undefined>(undefined);

interface ConstituencyProviderProps {
  children: ReactNode;
}

export const ConstituencyProvider: React.FC<ConstituencyProviderProps> = ({ children }) => {
  const [constituencyAreaList, setConstituencyAreaList] = useState<ConstituencyListType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConstituencies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/constituencies');
      let data: ConstituencyListType[] = response.data;
      
      // Filter out Bihar ID as per existing logic
      data = data.filter((ele: ConstituencyListType) => ele._id !== BiharId);
      
      setConstituencyAreaList(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`निर्वाचन क्षेत्रों को लोड करने में विफल: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchConstituencies();
  };

  useEffect(() => {
    fetchConstituencies();
  }, []);

  const value: ConstituencyContextType = {
    constituencyAreaList,
    loading,
    error,
    refetch,
  };

  return (
    <ConstituencyContext.Provider value={value}>
      {children}
    </ConstituencyContext.Provider>
  );
};

export const useConstituencies = (): ConstituencyContextType => {
  const context = useContext(ConstituencyContext);
  if (context === undefined) {
    throw new Error('useConstituencies must be used within a ConstituencyProvider');
  }
  return context;
};
