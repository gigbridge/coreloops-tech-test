import { AuthPageWrapper } from '@/src/components/wrappers/auth-page-wrapper';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthPageWrapper>{children}</AuthPageWrapper>;
}
