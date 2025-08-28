'use client';

import { ReactNode, useEffect } from 'react';

type ModalProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  children: ReactNode;
};

export function Modal({ open, onOpenChange, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black/50 absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="bg-background relative z-10 w-[90vw] max-w-2xl rounded-md border shadow-lg">
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children }: { children: ReactNode }) {
  return <div className="border-b px-4 py-3">{children}</div>;
}

export function ModalBody({ children }: { children: ReactNode }) {
  return <div className="max-h-[70vh] overflow-auto px-4 py-3">{children}</div>;
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="border-t px-4 py-3">{children}</div>;
}


