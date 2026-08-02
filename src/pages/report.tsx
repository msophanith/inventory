import { useState } from 'react';
import { useReport } from '../features/report/hooks/use-report';
import {
  ExportPasswordModal,
  ReportHeader,
  ReportSummary,
  ReportTable,
} from '../features/report/components';
import { PageContainer } from '../components/layout/page-container';

const ReportPage = () => {
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
    handleExportExcel,
    handleExportCsv,
    handleExportTodayCsv,
  } = useReport();

  const [exportModalState, setExportModalState] = useState<{
    isOpen: boolean;
    type: 'EXCEL' | 'MONTH_CSV' | 'TODAY_CSV';
  }>({
    isOpen: false,
    type: 'EXCEL',
  });

  const handleOpenExportModal = (type: 'EXCEL' | 'MONTH_CSV' | 'TODAY_CSV') => {
    setExportModalState({ isOpen: true, type });
  };

  const handleExecuteExport = (password?: string) => {
    if (exportModalState.type === 'EXCEL') {
      handleExportExcel(password);
    } else if (exportModalState.type === 'MONTH_CSV') {
      handleExportCsv(password);
    } else if (exportModalState.type === 'TODAY_CSV') {
      handleExportTodayCsv(password);
    }
  };

  return (
    <PageContainer className='relative space-y-8 pb-24 lg:pb-12 overflow-hidden'>
      {/* Decorative Ambient Background Glows */}
      <div className='pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl' />
      <div className='pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl' />
      <div className='pointer-events-none absolute bottom-10 left-1/4 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl' />

      {/* Top Status & Pill Tag */}
      <div className='flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500'>
        <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-xs backdrop-blur-xs'>
          <span className='relative flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
            <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
          </span>
          <span>Financial Analytics & Profit Intelligence</span>
        </div>
        <span className='text-xs font-medium text-slate-400 hidden sm:inline-block'>
          Period: <strong className='text-slate-700'>{activeMonthLabel}</strong>
        </span>
      </div>

      {/* Header with Month Selector & Export Actions */}
      <div className='animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75'>
        <ReportHeader
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          monthOptions={monthOptions}
          onExportExcel={() => handleOpenExportModal('EXCEL')}
          onExportCsv={() => handleOpenExportModal('MONTH_CSV')}
          onExportTodayCsv={() => handleOpenExportModal('TODAY_CSV')}
          onRefresh={() => refetch()}
          isRefreshing={isLoading}
        />
      </div>

      {/* Export Password Modal */}
      <ExportPasswordModal
        isOpen={exportModalState.isOpen}
        onClose={() =>
          setExportModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onExport={handleExecuteExport}
        exportType={exportModalState.type}
      />

      {/* Summary KPI Cards */}
      <div className='animate-in fade-in slide-in-from-bottom-3 duration-500 delay-150'>
        <ReportSummary
          summary={summary}
          monthLabel={activeMonthLabel}
          loading={isLoading}
        />
      </div>

      {/* Breakdown Tables (Product Summary & Transactions) */}
      <div className='animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200'>
        <ReportTable
          productReports={productReports}
          monthlyMovements={monthlyMovements}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          loading={isLoading}
        />
      </div>
    </PageContainer>
  );
};

export { ReportPage };
