import { z } from 'zod';

export const authFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;
