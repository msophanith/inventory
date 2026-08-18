import { Eye, EyeOff, Loader2, LogIn, Mail, Lock } from 'lucide-react';
import type { FormState, UseFormRegister } from 'react-hook-form';
import type { LoginFormValues } from '../../../features/auth/hooks/use-login';
import { useLanguage } from '../../../i18n/language-context';

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
  const { t } = useLanguage();
  const inputBase =
    'w-full rounded-2xl border bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4';
  const inputError =
    'border-rose-300 focus:border-rose-500 focus:ring-rose-100';
  const inputNormal =
    'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-100';

  return (
    <form onSubmit={onSubmit} noValidate className='space-y-5'>
      {/* Email Input */}
      <div>
        <label
          htmlFor='email'
          className='mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-700'
        >
          {t('auth.email')}
        </label>
        <div className='relative'>
          <Mail
            size={18}
            className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            id='email'
            type='email'
            autoComplete='email'
            placeholder='admin@inventory.com'
            {...register('email')}
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
        </div>
        {errors.email && (
          <p className='mt-1.5 text-xs font-bold text-rose-600 flex items-center gap-1'>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <div className='flex items-center justify-between mb-1.5'>
          <label
            htmlFor='password'
            className='block text-xs font-extrabold uppercase tracking-wider text-slate-700'
          >
            {t('auth.password')}
          </label>
        </div>
        <div className='relative'>
          <Lock
            size={18}
            className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            placeholder='••••••••'
            {...register('password')}
            className={`${inputBase} pr-12 ${
              errors.password ? inputError : inputNormal
            }`}
          />
          <button
            type='button'
            id='toggle-password'
            onClick={onTogglePassword}
            className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 p-1 rounded-lg'
            aria-label='Toggle password visibility'
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className='mt-1.5 text-xs font-bold text-rose-600 flex items-center gap-1'>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        id='btn-submit'
        type='submit'
        disabled={formState.isSubmitting}
        className='group mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-700 hover:to-blue-700 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-60'
      >
        {formState.isSubmitting ? (
          <Loader2 size={18} className='animate-spin' />
        ) : (
          <LogIn
            size={18}
            className='transition-transform group-hover:translate-x-0.5'
          />
        )}
        {formState.isSubmitting ? t('common.loading') : t('auth.signIn')}
      </button>
    </form>
  );
}
