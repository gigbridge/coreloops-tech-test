'use client';
import { getStorageItem, removeStorageItem, StorageKeys } from '@/src/lib/storage';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function isTokenExpired(token: string): boolean {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function useAuth() {
  const [state, setState] = useState({ loading: true, isAuthenticated: false });
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = getStorageItem(StorageKeys.AccessToken);
    if (!accessToken || isTokenExpired(accessToken)) {
      unauthenticate();
      return;
    }

    setState({ loading: false, isAuthenticated: true });
  }, [pathname]);

  const unauthenticate = () => {
    removeStorageItem(StorageKeys.AccessToken);
    setState({ loading: false, isAuthenticated: false });
  };

  return { loading: state.loading, isAuthenticated: state.isAuthenticated };
}
