import { useLanguage } from '../../../i18n/language-context';

export function MovementTableHead() {
  const { t } = useLanguage();

  return (
    <thead>
      <tr className='border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500'>
        <th className='px-5 py-3.5'>{t('movement.product')}</th>
        <th className='px-5 py-3.5'>{t('movement.movementType')}</th>
        <th className='px-5 py-3.5 text-center'>{t('movement.quantity')}</th>
        <th className='px-5 py-3.5 text-center'>{t('movement.remainingStock')}</th>
        <th className='px-5 py-3.5'>{t('movement.condition')}</th>
        <th className='px-5 py-3.5'>{t('movement.referenceNote')}</th>
        <th className='px-5 py-3.5 text-right'>{t('movement.dateTime')}</th>
      </tr>
    </thead>
  );
}
