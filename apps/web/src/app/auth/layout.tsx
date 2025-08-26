import { AuthLayoutWrapper } from '@/src/components/wrappers/auth-layout-wrapper';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
