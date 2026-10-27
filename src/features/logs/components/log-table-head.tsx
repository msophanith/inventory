import { useLanguage } from '@/i18n/language-context';

export function LogTableHead() {
  const { t } = useLanguage();

  return (
    <thead className='bg-slate-50/80 border-b border-slate-200/80'>
      <tr>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          {t('logs.action')}
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          {t('logs.product')}
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          {t('logs.changeDetails')}
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          {t('logs.performedBy')}
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          {t('logs.dateTime')}
        </th>
        <th className='px-4 py-3.5 text-right text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          {t('logs.action')}
        </th>
      </tr>
    </thead>
  );
}
