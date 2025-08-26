'use client';
import { createQueryClient } from '@/src/api/query-client';
import { Toaster } from '@coreloops-ui/sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import './global.css';

declare global {
  interface String {
    truncate(length: number): string;
  }
}

String.prototype.truncate = function (length: number) {
  return this.substring(0, length) + (this.length > length ? '...' : '');
};
export default function RootLayout({ children }: { children: ReactNode }) {
  const [client] = useState(() => createQueryClient());
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={client}>
          <main className="flex min-h-screen flex-1 flex-col bg-zinc-50 pt-16">{children}</main>
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
