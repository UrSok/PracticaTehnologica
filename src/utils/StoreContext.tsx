import React, { useContext } from 'react';
import RootStore from '../back-end/store/RootStore';

export const store: RootStore = new RootStore();

export const StoreContext = React.createContext<Partial<RootStore>>({});

export function useRootStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useRootStore must be used within RootStoreProvider');
  }
  return context;
}
