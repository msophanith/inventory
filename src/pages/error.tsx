import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import {
  Link,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { useLanguage } from '../i18n/language-context';

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useLanguage();

  let title = t('common.somethingWentWrong');
  let message = t('common.unexpectedError');

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;

    if (error.status === 404) {
      message = t('common.pageNotFound');
    } else if (typeof error.data === 'string') {
      message = error.data;
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-100 p-6'>
      <div className='w-full max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl'>
        <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
          <AlertTriangle className='text-red-500' size={40} />
        </div>

        <h1 className='mt-6 text-3xl font-bold'>{title}</h1>

        <p className='mt-3 text-slate-500'>{message}</p>

        <div className='mt-8 flex justify-center gap-4'>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-slate-100 cursor-pointer'
          >
            <ArrowLeft size={18} />
            {t('common.goBack')}
          </button>

          <button
            onClick={() => window.location.reload()}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 cursor-pointer'
          >
            <RefreshCw size={18} />
            {t('common.reload')}
          </button>
        </div>

        <Link
          to='/'
          className='mt-5 inline-flex items-center gap-2 text-indigo-600 hover:underline cursor-pointer'
        >
          <Home size={18} />
          {t('common.backToDashboard')}
        </Link>
      </div>
    </div>
  );
}

export { ErrorPage };
