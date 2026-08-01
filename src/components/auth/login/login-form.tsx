import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import type { FormState, UseFormRegister } from 'react-hook-form';
import type { LoginFormValues } from '../../../features/auth/hooks/use-login';

interface LoginFormProps {
  readonly register: UseFormRegister<LoginFormValues>;
  readonly errors: Partial<Record<keyof LoginFormValues, { message?: string }>>;
  readonly formState: FormState<LoginFormValues>;
  readonly showPassword: boolean;
  readonly onTogglePassword: () => void;
  readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function LoginForm({
  register,
  errors,
  formState,
  showPassword,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  const inputBase =
    'w-full rounded-2xl border bg-white/5 px-4 py-3 text-white placeholder-indigo-400/60 outline-none transition focus:ring-2 focus:ring-indigo-500';
  const inputError = 'border-red-500/50 focus:ring-red-500';
  const inputNormal = 'border-white/10 hover:border-white/20';

  return (
    <form onSubmit={onSubmit} noValidate className='space-y-4'>
      {/* Email */}
      <div>
        <label
          htmlFor='email'
          className='mb-1.5 block text-sm font-medium text-indigo-200'
        >
          Email address
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          placeholder='you@example.com'
          {...register('email')}
          className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
        />
        {errors.email && (
          <p className='mt-1.5 text-xs text-red-400'>{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor='password'
          className='mb-1.5 block text-sm font-medium text-indigo-200'
        >
          Password
        </label>
        <div className='relative'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            placeholder='••••••••'
            {...register('password')}
            className={`${inputBase} pr-12 ${errors.password ? inputError : inputNormal}`}
          />
          <button
            type='button'
            id='toggle-password'
            onClick={onTogglePassword}
            className='absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-400 transition hover:text-white'
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className='mt-1.5 text-xs text-red-400'>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        id='btn-submit'
        type='submit'
        disabled={formState.isSubmitting}
        className='mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-blue-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-blue-400 disabled:opacity-60'
      >
        {formState.isSubmitting ? (
          <Loader2 size={18} className='animate-spin' />
        ) : (
          <LogIn size={18} />
        )}
        {formState.isSubmitting ? 'Please wait…' : 'Sign In'}
      </button>
    </form>
  );
}
