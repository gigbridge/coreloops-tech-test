'use client';
import { useAuth } from '@/src/hooks/use-auth';
import { RouteEnum } from '@/src/routes';
import { Spinner } from '@coreloops-ui/spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export function AuthLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !loading && pathname.startsWith('/auth')) {
      router.push(RouteEnum.Home);
    }
  }, [pathname, router, loading]);

  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
