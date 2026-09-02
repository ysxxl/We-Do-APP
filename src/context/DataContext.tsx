import { createContext, useContext, type ReactNode } from 'react';
import { useUserData } from '@/hooks/useUserData';
import type { Task } from '@/data/mockData';

type DataContextValue = ReturnType<typeof useUserData>;

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const data = useUserData();
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
