import type { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'cashier';

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export type AuthUser = User & {
  role: UserRole;
  fullName: string | null;
};

