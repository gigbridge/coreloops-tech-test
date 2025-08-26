'use client';
import { useApiMutation } from '@/src/api/hooks/use-api-mutation';
import { authFormSchema, AuthFormValues } from '@/src/components/forms/schemas/auth-form.schema';
import { setStorageItem, StorageKeys } from '@/src/lib/storage';
import { RouteEnum } from '@/src/routes';
import { Button } from '@coreloops-ui/button';
import { Card } from '@coreloops-ui/card';
import { Body } from '@coreloops-ui/coreloops/body';
import { ControlledInput } from '@coreloops-ui/coreloops/controlled-input';
import { Heading } from '@coreloops-ui/coreloops/heading';
import { Form } from '@coreloops-ui/form';
import { PostSignInPostDto, ViewSignInDto } from '@coreloops/shared-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function EmailForm() {
  const router = useRouter();

  const params = useSearchParams();

  const isSignIn = params.get('signIn') === 'true';

  const form = useForm({
    resolver: zodResolver(authFormSchema),
  });

  const { isDirty, isValid } = form.formState;

  const onSuccess = (data: ViewSignInDto) => {
    setStorageItem(StorageKeys.AccessToken, data.accessToken);
    router.replace(RouteEnum.Home);
  };

  const { mutateAsync: login, isPending: loginPending } = useApiMutation<PostSignInPostDto, ViewSignInDto>(
    '/auth/sign-in',
    'POST',
    {
      onSuccess,
    },
  );
  const { mutateAsync: signup, isPending: signupPending } = useApiMutation<PostSignInPostDto, ViewSignInDto>(
    '/auth/sign-up',
    'POST',
    {
      onSuccess,
    },
  );

  const handleNavigateToSignUp = () => {
    router.replace('?signIn=false');
  };

  const handleNavigationToSignIn = () => {
    router.replace('?signIn=true');
  };

  const handleSubmit = async (values: AuthFormValues) => {
    const method = isSignIn ? login : signup;
    try {
      await method({
        username: values.username,
        password: values.password,
      });
    } catch (e) {
      toast('Something went wrong', {
        description: 'Please try again',
        closeButton: true,
        classNames: {
          closeButton: 'text-card-foreground hover:text-card-foreground hover:bg-card-foreground',
          description: 'text-red-500',
        },
      });
    }
  };

  return (
    <Card className="border-border w-full max-w-md gap-6 rounded-lg border-1 p-6">
      <div className="flex flex-col gap-1">
        <Heading>{isSignIn ? 'Login' : 'Sign Up'}</Heading>
        {isSignIn && <Body variant="muted">Enter your username and password to login to your account.</Body>}

        {!isSignIn && <Body variant="muted">Enter your username and a new password to create your account</Body>}
      </div>
      <div>
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <ControlledInput
              label="Username"
              control={form.control}
              type="username"
              name="username"
              placeholder="Enter your username"
              className="border-input rounded-md border-1"
            />
            <ControlledInput
              label="Password"
              control={form.control}
              type="password"
              name="password"
              placeholder="Enter your password"
              className="border-input rounded-md border-1"
            />
          </div>
        </Form>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          disabled={!isDirty || !isValid || signupPending || loginPending}
          className="bg-primary cursor-pointer"
          onClick={form.handleSubmit(handleSubmit)}
        >
          Login
        </Button>
        {isSignIn && (
          <Body variant="normal" className="text-center">
            Don't have an account?{' '}
            <Button
              onClick={handleNavigateToSignUp}
              variant="link"
              size="sm"
              asChild
              className="font-inter text-card-foreground cursor-pointer p-0 underline"
            >
              <span>Sign up</span>
            </Button>
          </Body>
        )}
        {!isSignIn && (
          <Body variant="normal" className="text-center">
            Already have an account?{' '}
            <Button
              onClick={handleNavigationToSignIn}
              variant="link"
              size="sm"
              asChild
              className="font-inter text-card-foreground cursor-pointer p-0 underline"
            >
              <span>Log In</span>
            </Button>
          </Body>
        )}
      </div>
    </Card>
  );
}
