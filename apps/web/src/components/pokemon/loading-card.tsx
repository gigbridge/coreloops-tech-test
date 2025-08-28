'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@coreloops-ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';

export function LoadingCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-5 w-40" />
        <Skeleton className="h-28 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}


