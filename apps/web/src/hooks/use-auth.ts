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
  const [state, setState] = useState({ loading: true, isAuthenticated: false, isAdmin: false });
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = getStorageItem(StorageKeys.AccessToken);
    if (!accessToken || isTokenExpired(accessToken)) {
      unauthenticate();
      return;
    }

    let isAdmin = false;
    try {
      const decoded: any = jwtDecode(accessToken);
      // Accept either top-level isAdmin or nested claim
      isAdmin = !!(decoded?.isAdmin ?? decoded?.user?.isAdmin);
    } catch {}

    setState({ loading: false, isAuthenticated: true, isAdmin });
  }, [pathname]);

  const unauthenticate = () => {
    removeStorageItem(StorageKeys.AccessToken);
    setState({ loading: false, isAuthenticated: false, isAdmin: false });
  };

  return { loading: state.loading, isAuthenticated: state.isAuthenticated, isAdmin: state.isAdmin };
}
