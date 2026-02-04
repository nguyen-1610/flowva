import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const SignupSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6, 'Mật khẩu xác nhận phải có ít nhất 6 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;

export type AuthResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

export interface CurrentUser {
  id?: string;
  name: string;
  email: string;
  avatar: string;
}
