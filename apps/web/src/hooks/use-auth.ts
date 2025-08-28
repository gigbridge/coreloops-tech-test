'use client';
import { getStorageItem, removeStorageItem, StorageKeys } from '@/src/lib/storage';
import { ViewUserDto } from '@coreloops/shared-types';
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

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  user: ViewUserDto | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    loading: true,
    isAuthenticated: false,
    user: null,
  });
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = getStorageItem(StorageKeys.AccessToken);
    if (!accessToken || isTokenExpired(accessToken)) {
      unauthenticate();
      return;
    }

    // Decode token to get user information
    try {
      const decoded: { sub: string; username: string; isAdmin?: boolean } = jwtDecode(accessToken);

      // For now, we'll create a minimal user object from the token
      // In a real app, you might want to fetch user details from an API endpoint
      const user: ViewUserDto = {
        id: decoded.sub,
        username: decoded.username,
        isAdmin: decoded.isAdmin || false, // Default to false if not present
      };

      setState({ loading: false, isAuthenticated: true, user });
    } catch (error) {
      console.error('Failed to decode token:', error);
      unauthenticate();
    }
  }, [pathname]);

  const unauthenticate = () => {
    removeStorageItem(StorageKeys.AccessToken);
    setState({ loading: false, isAuthenticated: false, user: null });
  };

  return {
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isAdmin: state.user?.isAdmin || false,
  };
}
