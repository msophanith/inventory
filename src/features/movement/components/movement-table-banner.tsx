import { useLanguage } from '../../../i18n/language-context';

interface Props {
  readonly monthLabel: string;
}

export function MovementTableBanner({ monthLabel }: Props) {
  const { t } = useLanguage();

  return (
    <div>
      <div className='flex items-center gap-2.5 flex-wrap'>
        <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
          {t('movement.history')}
        </h1>
        <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/60'>
          {t('movement.thisMonth', { month: monthLabel })}
        </span>
      </div>
      <p className='text-sm text-slate-500 mt-1'>
        {t('movement.historyDesc', { month: monthLabel })}
      </p>
    </div>
  );
}
