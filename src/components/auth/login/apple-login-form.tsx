import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import type { FormState, UseFormRegister } from 'react-hook-form';
import type { LoginFormValues } from '@/features/auth/hooks/use-login';
import { useLanguage } from '@/i18n/language-context';

interface AppleLoginFormProps {
  readonly register: UseFormRegister<LoginFormValues>;
  readonly errors: Partial<Record<keyof LoginFormValues, { message?: string }>>;
  readonly formState: FormState<LoginFormValues>;
  readonly showPassword: boolean;
  readonly onTogglePassword: () => void;
  readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  readonly onQuickFillDemo?: () => void;
}

export function AppleLoginForm({
  register,
  errors,
  formState,
  showPassword,
  onTogglePassword,
  onSubmit,
  onQuickFillDemo,
}: AppleLoginFormProps) {
  const { t } = useLanguage();

  const inputStyle =
    'w-full rounded-2xl border bg-slate-100/80 py-3 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4';
  const errorBorder = 'border-rose-300 focus:border-rose-500 focus:ring-rose-100';
  const normalBorder =
    'border-slate-200/80 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/15';

  return (
    <form onSubmit={onSubmit} noValidate className='space-y-4 text-left'>
      {/* Email Field */}
      <div>
        <div className='flex items-center justify-between mb-1.5'>
          <label
            htmlFor='apple-email'
            className='block text-[11px] font-semibold tracking-wider uppercase text-slate-500'
          >
            {t('auth.email')}
          </label>
          {!import.meta.env.PROD && onQuickFillDemo && (
            <button
              type='button'
              onClick={onQuickFillDemo}
              className='inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer'
            >
              <Sparkles size={11} className='text-amber-500' />
              {t('auth.fillDemo')}
            </button>
          )}
        </div>
        <div className='relative'>
          <Mail
            size={16}
            className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            id='apple-email'
            type='email'
            autoComplete='email'
            placeholder='admin@inventory.com'
            {...register('email')}
            className={`${inputStyle} ${errors.email ? errorBorder : normalBorder}`}
          />
        </div>
        {errors.email && (
          <p className='mt-1 text-xs font-medium text-rose-500'>{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label
          htmlFor='apple-password'
          className='block mb-1.5 text-[11px] font-semibold tracking-wider uppercase text-slate-500'
        >
          {t('auth.password')}
        </label>
        <div className='relative'>
          <Lock
            size={16}
            className='pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            id='apple-password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            placeholder='••••••••'
            {...register('password')}
            className={`${inputStyle} pr-11 ${errors.password ? errorBorder : normalBorder}`}
          />
          <button
            type='button'
            onClick={onTogglePassword}
            className='absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer'
            aria-label='Toggle password visibility'
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className='mt-1 text-xs font-medium text-rose-500'>{errors.password.message}</p>
        )}
      </div>

      {/* Apple-style Primary Sign In Button */}
      <button
        type='submit'
        disabled={formState.isSubmitting}
        className='w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#0077ED] to-[#0062C4] hover:from-[#0082FB] hover:to-[#006EDD] text-white py-3.5 text-sm font-semibold shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer'
      >
        {formState.isSubmitting ? (
          <Loader2 size={17} className='animate-spin' />
        ) : (
          <span>{t('auth.signIn')}</span>
        )}
      </button>
    </form>
  );
}
