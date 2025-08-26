import { cn } from '@/src/lib/utils';

type SpinnerProps = {
  size?: number;
  className?: string;
};

export const Spinner = ({ size = 46, className }: SpinnerProps) => {
  return (
    <div
      className={cn('border-primary/30 border-t-primary animate-spin rounded-full border-8', className)}
      style={{ width: size, height: size }}
    />
  );
};
