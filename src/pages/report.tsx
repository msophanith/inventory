import { useState } from 'react';
import { PageMeta } from '../components/seo/page-meta';
import { useLanguage } from '../i18n/language-context';
import { useReport } from '../features/report/hooks/use-report';
import {
  ReportHeader,
  ReportSummary,
  ReportTable,
} from '../features/report/components';
import { ReportExportModals } from '../features/report/components/report-export-modals';
import { ReportSkeleton } from '../features/report/components/report-skeleton';
import { ReportRevenueCOGSChart } from '../features/report/components/report-revenue-cogs-chart';
import { PageContainer } from '../components/layout/page-container';
import { DashboardSalesMarginChart } from '../features/dashboard/components/dashboard-sales-margin-chart';
import { useMovement } from '../features/movement/hooks/use-movement';

export function ReportPage() {
  const {
    isLoading,
    refetch,
    selectedMonth,
    setSelectedMonth,
    searchQuery,
    setSearchQuery,
    monthOptions,
    activeMonthLabel,
    summary,
    productReports,
    monthlyMovements,
    rawMovements,
    dateMode,
    setDateMode,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    handleExportExcel,
    handleExportCsv,
    handleExportTodayCsv,
    handleExportProductInExcel,
    handleExportNewProductExcel,
  } = useReport();

  const { data: movements, isLoading: isMovementLoading } = useMovement();
  const { t } = useLanguage();
  const [isExportCenterOpen, setIsExportCenterOpen] = useState(false);

  return (
    <PageContainer className='relative space-y-8 pb-24 lg:pb-12 overflow-hidden'>
      <PageMeta
        title='Reports'
        description='Financial analytics, revenue vs COGS, sales margins, and detailed movement reports.'
      />
      {/* Decorative Ambient Background Glows */}
      <div className='pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl' />
      <div className='pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl' />
      <div className='pointer-events-none absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl' />

      {/* Top Status & Active Period Pill */}
      <div className='flex items-center justify-between'>
        <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-xs backdrop-blur-xs'>
          <span className='relative flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
            <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
          </span>
          <span>{t('reports.financialAnalytics')}</span>
        </div>
        <span className='text-xs font-medium text-slate-400 hidden sm:inline-block'>
          {t('reports.period')}:{' '}
          <strong className='text-slate-700 font-extrabold'>
            {activeMonthLabel}
          </strong>
        </span>
      </div>

      {/* Header with Month/Range Selector & Export Actions */}
      <ReportHeader
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        monthOptions={monthOptions}
        onOpenExportCenter={() => setIsExportCenterOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
        dateMode={dateMode}
        onDateModeChange={setDateMode}
        customStart={customStart}
        customEnd={customEnd}
        onCustomStartChange={setCustomStart}
        onCustomEndChange={setCustomEnd}
      />

      {/* Export Center & Password Modals */}
      <ReportExportModals
        isOpen={isExportCenterOpen}
        onClose={() => setIsExportCenterOpen(false)}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        onExportTodayCsv={handleExportTodayCsv}
        onExportProductInExcel={handleExportProductInExcel}
        onExportNewProductExcel={handleExportNewProductExcel}
      />

      {/* Content vs Skeleton */}
      {isLoading || isMovementLoading ? (
        <ReportSkeleton />
      ) : (
        <>
          <ReportSummary summary={summary} monthLabel={activeMonthLabel} />

          <div className='space-y-6'>
            <ReportRevenueCOGSChart
              rawMovements={rawMovements}
              isLoading={isLoading || isMovementLoading}
            />
            <DashboardSalesMarginChart
              movements={movements}
              isLoading={isMovementLoading || isLoading}
            />
          </div>

          <ReportTable
            productReports={productReports}
            monthlyMovements={monthlyMovements}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            loading={isLoading}
          />
        </>
      )}
    </PageContainer>
  );
}

export default ReportPage;
