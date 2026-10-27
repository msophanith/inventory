import { Navigate } from 'react-router-dom';
import { PageMeta } from '@/components/seo/page-meta';

import { useAuth } from '@/features/auth/use-auth';
import { useLogin } from '@/features/auth/hooks/use-login';
import { isMobileDevice } from '@/utils/device';
import { LoginShowcasePanel } from '@/components/auth/login/login-showcase-panel';
import { LoginLanguageToggle } from '@/components/auth/login/login-language-toggle';
import { LoginBrand } from '@/components/auth/login/login-brand';
import { LoginAlerts } from '@/components/auth/login/login-alerts';
import { LoginForm } from '@/components/auth/login/login-form';
import { LoginFooter } from '@/components/auth/login/login-footer';

export const LoginPage = () => {
  const { user } = useAuth();
  const {
    form,
    errors,
    formState,
    showPassword,
    setShowPassword,
    serverError,
    handleSubmit,
  } = useLogin();

  if (user) {
    const destination = isMobileDevice() ? '/scan' : '/';
    return <Navigate to={destination} replace />;
  }

  const handleQuickFillDemo = import.meta.env.PROD
    ? undefined
    : () => {
        form.setValue('email', 'admin@inventory.com', { shouldValidate: true });
        form.setValue('password', 'password123', { shouldValidate: true });
      };

  return (
    <div className='relative min-h-screen bg-slate-950 selection:bg-indigo-600 selection:text-white'>
      <PageMeta
        title='Login'
        description='Sign in to manage MeanLeap inventory and point of sale terminal.'
      />

      <div className='grid min-h-screen lg:grid-cols-12'>
        {/* Left Side: Modern Retail POS Showcase Panel */}
        <LoginShowcasePanel />

        {/* Right Side: Authentication Station */}
        <div className='flex lg:col-span-5 flex-col justify-between bg-white px-6 py-8 sm:px-10 lg:px-12 xl:px-14'>
          {/* Top Bar with Language Toggle */}
          <div className='flex items-center justify-end'>
            <LoginLanguageToggle />
          </div>

          {/* Centered Form Area */}
          <div className='my-auto mx-auto w-full max-w-sm py-8'>
            <LoginBrand />
            <LoginAlerts serverError={serverError} />
            <LoginForm
              register={form.register}
              errors={errors}
              formState={formState}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
              onSubmit={handleSubmit}
              onQuickFillDemo={handleQuickFillDemo}
            />
          </div>

          {/* Bottom Footer */}
          <LoginFooter />
        </div>
      </div>
    </div>
  );
};
