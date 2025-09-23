'use client';

import { ReactNode } from 'react';
import { useUserSync } from './useUserSync';

interface UserSyncProviderProps {
  children: ReactNode;
}

export const UserSyncProvider = ({ children }: UserSyncProviderProps) => {
  // This hook automatically syncs the user when they authenticate
  useUserSync();
  
  return <>{children}</>;
};