'use client';
import { useAuth } from '@/src/hooks/use-auth';
import { RouteEnum } from '@/src/routes';
import { Spinner } from '@coreloops-ui/spinner';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode; // optional custom loading
};

export const AuthPageWrapper = ({ children, fallback }: Props) => {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push(RouteEnum.Root);
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated)
    return (
      fallback || (
        <div className="flex h-full w-full flex-1 items-center justify-center">
          <Spinner />
        </div>
      )
    );

  return <>{children}</>;
};
