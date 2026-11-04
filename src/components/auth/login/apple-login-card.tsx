import { Store } from 'lucide-react';
import type { FormState, UseFormRegister } from 'react-hook-form';
import type { LoginFormValues } from '@/features/auth/hooks/use-login';
import { useLanguage } from '@/i18n/language-context';
import { LoginAlerts } from './login-alerts';
import { AppleLoginForm } from './apple-login-form';
import { AppleLoginFeatures } from './apple-login-features';

interface AppleLoginCardProps {
  readonly register: UseFormRegister<LoginFormValues>;
  readonly errors: Partial<Record<keyof LoginFormValues, { message?: string }>>;
  readonly formState: FormState<LoginFormValues>;
  readonly showPassword: boolean;
  readonly onTogglePassword: () => void;
  readonly onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  readonly onQuickFillDemo?: () => void;
  readonly serverError: string | null;
}

export function AppleLoginCard({
  register,
  errors,
  formState,
  showPassword,
  onTogglePassword,
  onSubmit,
  onQuickFillDemo,
  serverError,
}: AppleLoginCardProps) {
  const { t } = useLanguage();

  return (
    <div className='w-full max-w-md mx-auto rounded-[32px] bg-white/85 backdrop-blur-3xl border border-white/80 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08),0_0_1px_1px_rgba(255,255,255,0.9)_inset] transition-all'>
      {/* Brand Squircle Header */}
      <div className='flex flex-col items-center text-center mb-6 space-y-3'>
        <div className='relative flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-blue-500 via-indigo-600 to-indigo-700 text-white shadow-xl shadow-blue-500/25 ring-1 ring-white/60'>
          <Store size={30} className='stroke-[2.2]' />
          <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white text-[9px] font-bold text-white'>
            ✓
          </span>
        </div>

        <div>
          <div className='flex items-center justify-center gap-1.5'>
            <h1 className='text-xl font-bold tracking-tight text-slate-900'>
              {t('common.appName')}
            </h1>
            <span className='rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-200/60'>
              POS Hub
            </span>
          </div>
          <p className='text-xs text-slate-500 font-normal mt-1'>
            {t('auth.portalSubtitle')}
          </p>
        </div>
      </div>

      <LoginAlerts serverError={serverError} />

      <AppleLoginForm
        register={register}
        errors={errors}
        formState={formState}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
        onSubmit={onSubmit}
        onQuickFillDemo={onQuickFillDemo}
      />

      <AppleLoginFeatures />
    </div>
  );
}
