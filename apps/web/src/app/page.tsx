'use client';
import { RouteEnum } from '@/src/routes';
import { Button } from '@coreloops-ui/button';
import { Card } from '@coreloops-ui/card';
import { Body } from '@coreloops-ui/coreloops/body';
import { Heading } from '@coreloops-ui/coreloops/heading';
import { useRouter } from 'next/navigation';

export default function Index() {
  const router = useRouter();

  const toSignIn = () => {
    router.push(RouteEnum.AuthLogin);
  };
  const toSignUp = () => {
    router.push(RouteEnum.AuthSignUp);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center gap-4">
      <Card className="border-border flex w-full max-w-md gap-6 rounded-lg border-1 p-6">
        <Heading variant="h3">Coreloops - Tech Test</Heading>
        <Body>If you already have an account in your local database (poke_users) table then sign in.</Body>
        <Body>Otherwise, sign up</Body>
        <Button onClick={toSignIn}>Sign In</Button>
        <Button onClick={toSignUp} variant="secondary">
          Sign Up
        </Button>
      </Card>
    </div>
  );
}
