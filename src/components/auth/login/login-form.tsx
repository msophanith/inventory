import { Eye, EyeOff, Loader2, LogIn, Mail, Lock, Shield, Sparkles } from 'lucide-react';
import type { FormState, UseFormRegister } from 'react-hook-form';
import type { LoginFormValues } from '@/features/auth/hooks/use-login';
import { useLanguage } from '@/i18n/language-context';

interface LoginFormProps {
  readonly register: UseFormRegister<LoginFormValues>;
  readonly errors: Partial<Record<keyof LoginFormValues, { message?: string }>>;
  readonly formState: FormState<LoginFormValues>;
  readonly showPassword: boolean;
  readonly onTogglePassword: () => void;
  readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  readonly onQuickFillDemo?: () => void;
}

export function LoginForm({
  register,
  errors,
  formState,
  showPassword,
  onTogglePassword,
  onSubmit,
  onQuickFillDemo,
}: LoginFormProps) {
  const { t } = useLanguage();
  const inputBase =
    'w-full rounded-2xl border bg-slate-50/80 py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4';
  const inputError =
    'border-rose-300 focus:border-rose-500 focus:ring-rose-100';
  const inputNormal =
    'border-slate-200/90 hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-100';

  return (
    <form onSubmit={onSubmit} noValidate className='space-y-4'>
      {/* Email Input */}
      <div>
        <div className='flex items-center justify-between mb-1.5'>
          <label
            htmlFor='email'
            className='block text-[11px] font-extrabold uppercase tracking-wider text-slate-600'
          >
            {t('auth.email')}
          </label>
          {!import.meta.env.PROD && onQuickFillDemo && (
            <button
              type='button'
              onClick={onQuickFillDemo}
              className='inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer'
            >
              <Sparkles size={11} className='text-amber-500' />
              {t('auth.fillDemo')}
            </button>
          )}
        </div>
        <div className='relative'>
          <Mail
            size={17}
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
          <p className='mt-1 text-xs font-semibold text-rose-600'>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <label
          htmlFor='password'
          className='block mb-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-600'
        >
          {t('auth.password')}
        </label>
        <div className='relative'>
          <Lock
            size={17}
            className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
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
            className='absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 p-1 rounded-lg'
            aria-label='Toggle password visibility'
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && (
          <p className='mt-1 text-xs font-semibold text-rose-600'>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        id='btn-submit'
        type='submit'
        disabled={formState.isSubmitting}
        className='group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-indigo-700 to-blue-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:from-indigo-700 hover:to-blue-700 hover:shadow-indigo-600/35 active:scale-[0.98] disabled:opacity-60 cursor-pointer'
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

      {/* Security badge note */}
      <div className='pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium'>
        <Shield size={12} className='text-emerald-500' />
        <span>{t('auth.secureConnection')}</span>
      </div>
    </form>
  );
}
