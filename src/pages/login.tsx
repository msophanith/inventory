import { Navigate } from 'react-router-dom';
import { PageMeta } from '@/components/seo/page-meta';
import { useAuth } from '@/features/auth/use-auth';
import { useLogin } from '@/features/auth/hooks/use-login';
import { isMobileDevice } from '@/utils/device';
import { AppleLoginHeader } from '@/components/auth/login/apple-login-header';
import { AppleLoginCard } from '@/components/auth/login/apple-login-card';
import { AppleLoginFooter } from '@/components/auth/login/apple-login-footer';

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
    <div className='relative min-h-screen w-full overflow-hidden bg-[#f5f5f7] flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-blue-600 selection:text-white'>
      <PageMeta
        title='Login'
        description='Sign in to manage MeanLeap inventory and point of sale terminal.'
      />

      {/* Apple Light Mode Ambient Mesh Gradients */}
      <div className='pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-130 w-187.5 rounded-full bg-linear-gradient-to-tr from-blue-200/40 via-indigo-100/35 to-teal-100/30 blur-[130px]' />
      <div className='pointer-events-none absolute -bottom-40 right-10 h-112.5 w-137.5 rounded-full bg-linear-gradient-to-tr from-purple-100/40 via-rose-100/25 to-sky-100/30 blur-[120px]' />
      <div className='pointer-events-none absolute top-1/3 -left-20 h-95 w-95 rounded-full bg-linear-gradient-to-br from-indigo-100/30 to-sky-100/25 blur-[100px]' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(#0f172a_1px,transparent_1px)] background-size-[28px_28px] opacity-[0.025]' />

      {/* Top Floating Header with Dynamic Status & Language Toggle */}
      <div className='relative z-10 w-full pt-2'>
        <AppleLoginHeader />
      </div>

      {/* Centered Apple Glass Card */}
      <main className='relative z-10 my-auto w-full flex items-center justify-center py-4'>
        <AppleLoginCard
          register={form.register}
          errors={errors}
          formState={formState}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((v) => !v)}
          onSubmit={handleSubmit}
          onQuickFillDemo={handleQuickFillDemo}
          serverError={serverError}
        />
      </main>

      {/* Apple Ecosystem Minimal Footer */}
      <div className='relative z-10 w-full pb-2'>
        <AppleLoginFooter />
      </div>
    </div>
  );
};
