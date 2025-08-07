import { z } from 'zod';

// Password strength validation schema
export const passwordStrengthSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/\p{Ll}/u, 'Password must contain at least one lowercase letter')
  .regex(/\p{Lu}/u, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

// Registration form validation schema
export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[\p{L}\s]+$/u, 'Name can only contain letters and spaces'),
    email: z.string().email('Please enter a valid email address'),
    password: passwordStrengthSchema,
    confirmPassword: z.string().min(1, 'Confirm Password must match the Password'),
  })
  .refine((data: { password: string; confirmPassword: string }) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string(),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const newPasswordSchema = z
  .object({
    newPassword: passwordStrengthSchema,
    confirmPassword: z.string().min(1, 'Confirm Password must match the New Password'),
  })
  .refine((data: { newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
