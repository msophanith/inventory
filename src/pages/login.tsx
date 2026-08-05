import { Navigate } from 'react-router-dom';

import { useAuth } from '../features/auth/use-auth';
import { useLogin } from '../features/auth/hooks/use-login';
import { LoginBrand } from '../components/auth/login/login-brand';
import { LoginAlerts } from '../components/auth/login/login-alerts';
import { LoginForm } from '../components/auth/login/login-form';
import { LoginFooter } from '../components/auth/login/login-footer';

const LoginPage = () => {
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

  if (user) return <Navigate to='/' replace />;

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 selection:bg-indigo-600 selection:text-white'>
      {/* Subtle Background Lighting & Mesh Accents */}
      <div className='pointer-events-none absolute -left-40 -top-40 h-125 w-125 rounded-full bg-linear-to-tr from-indigo-200/40 via-blue-200/30 to-transparent blur-[100px]' />
      <div className='pointer-events-none absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-linear-to-br from-purple-200/40 via-indigo-100/50 to-transparent blur-[100px]' />

      {/* Soft Grid Background Overlay */}
      <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-size-[3rem_3rem]' />

      <div className='relative z-10 w-full max-w-md'>
        {/* Main Clean Card */}
        <div className='rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10'>
          <LoginBrand />
          <LoginAlerts serverError={serverError} />
          <LoginForm
            register={form.register}
            errors={errors}
            formState={formState}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword((v) => !v)}
            onSubmit={handleSubmit}
          />
        </div>
        <LoginFooter />
      </div>
    </div>
  );
};

export { LoginPage };
