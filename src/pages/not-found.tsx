import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/language-context';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center'>
      <h1 className='text-6xl font-bold'>404</h1>

      <p className='mt-4 text-gray-500'>{t('common.pageNotFound')}</p>

      <Link to='/' className='mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition cursor-pointer'>
        {t('common.goHome')}
      </Link>
    </div>
  );
}
