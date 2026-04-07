import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { RFP } from '@/types/sleq';
import { MOCK_RFPS } from '@/data/mockData';

interface RfpContextType {
  rfps: RFP[];
  getRfp: (id: string) => RFP | undefined;
  addRfp: (rfp: RFP) => void;
  getNextCaseNumber: () => number;
}

const RfpContext = createContext<RfpContextType | null>(null);

export function useRfpContext() {
  const ctx = useContext(RfpContext);
  if (!ctx) throw new Error('useRfpContext must be used within RfpProvider');
  return ctx;
}

const RFP_STORAGE_KEY = 'sleq_rfps';

function loadRfps(): RFP[] {
  try {
    const stored = localStorage.getItem(RFP_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [...MOCK_RFPS];
}

export function RfpProvider({ children }: { children: ReactNode }) {
  const [rfps, setRfps] = useState<RFP[]>(loadRfps);

  // Persist on change
  React.useEffect(() => {
    localStorage.setItem(RFP_STORAGE_KEY, JSON.stringify(rfps));
  }, [rfps]);

  const getRfp = useCallback((id: string) => rfps.find(r => r.id === id), [rfps]);

  const addRfp = useCallback((rfp: RFP) => {
    setRfps(prev => [rfp, ...prev]);
  }, []);

  const getNextCaseNumber = useCallback(() => {
    const max = rfps.reduce((m, r) => Math.max(m, r.caseNumber), 0);
    return max + 1;
  }, [rfps]);

  return (
    <RfpContext.Provider value={{ rfps, getRfp, addRfp, getNextCaseNumber }}>
      {children}
    </RfpContext.Provider>
  );
}
