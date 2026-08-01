import { useReport } from '../features/report/hooks/use-report';
import {
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
  } = useReport();

  return (
    <PageContainer className='space-y-8'>
      {/* Header with Month Selector & Export Actions */}
      <ReportHeader
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        monthOptions={monthOptions}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        onRefresh={() => refetch()}
        isRefreshing={isLoading}
      />

      {/* Summary KPI Cards */}
      <ReportSummary
        summary={summary}
        monthLabel={activeMonthLabel}
        loading={isLoading}
      />

      {/* Breakdown Tables (Product Summary & Transactions) */}
      <ReportTable
        productReports={productReports}
        monthlyMovements={monthlyMovements}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={isLoading}
      />
    </PageContainer>
  );
};

export { ReportPage };
