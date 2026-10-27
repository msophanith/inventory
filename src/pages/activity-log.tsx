import { ScrollText } from 'lucide-react';
import { PageMeta } from '@/components/seo/page-meta';
import { PageContainer } from '@/components/layout/page-container';
import { ActivityLogTable } from '@/features/logs/components/log-table';
import { useLanguage } from '@/i18n/language-context';

export function ActivityLogPage() {
  const { t } = useLanguage();

  return (
    <PageContainer className='space-y-4 sm:space-y-6'>
      <PageMeta
        title={t('logs.productLogs')}
        description={t('logs.productLogsDesc')}
      />

      {/* Responsive Header Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3'>
        <div>
          <div className='flex items-center gap-2 sm:gap-2.5 mb-1'>
            <div className='h-8 w-8 sm:h-9 sm:w-9 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0'>
              <ScrollText size={18} className='sm:w-5 sm:h-5' />
            </div>
            <h1 className='text-xl sm:text-2xl font-black text-slate-900 tracking-tight'>
              {t('logs.productLogs')}
            </h1>
          </div>
          <p className='text-[11px] sm:text-xs text-slate-500 font-medium'>
            {t('logs.productLogsDesc')}
          </p>
        </div>
      </div>

      {/* Main Table & Filters */}
      <ActivityLogTable />
    </PageContainer>
  );
}
