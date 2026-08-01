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
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-indigo-950 px-4'>
      {/* Decorative blobs */}
      <div className='pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl' />
      <div className='pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl' />

      <div className='relative z-10 w-full max-w-md'>
        <div className='rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl'>
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
