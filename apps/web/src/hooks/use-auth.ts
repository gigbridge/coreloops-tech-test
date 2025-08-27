'use client';
import { getStorageItem, removeStorageItem, StorageKeys } from '@/src/lib/storage';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface JwtPayload {
  sub: string;
  username: string;
  isAdmin?: boolean;
  exp: number;
}

function isTokenExpired(token: string): boolean {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getTokenPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [state, setState] = useState({
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    userId: null as string | null,
    username: null as string | null,
  });
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = getStorageItem(StorageKeys.AccessToken);
    if (!accessToken || isTokenExpired(accessToken)) {
      unauthenticate();
      return;
    }

    const payload = getTokenPayload(accessToken);
    if (!payload) {
      unauthenticate();
      return;
    }

    setState({
      loading: false,
      isAuthenticated: true,
      isAdmin: payload.isAdmin || false,
      userId: payload.sub,
      username: payload.username,
    });
  }, [pathname]);

  const unauthenticate = () => {
    removeStorageItem(StorageKeys.AccessToken);
    setState({
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      userId: null,
      username: null,
    });
  };

  return {
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    isAdmin: state.isAdmin,
    userId: state.userId,
    username: state.username,
  };
}
