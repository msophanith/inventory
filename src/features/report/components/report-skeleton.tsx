import { ReportKpiSkeleton } from './skeleton/report-kpi-skeleton';
import { ReportChartsSkeleton } from './skeleton/report-charts-skeleton';
import { ReportTableSkeleton } from './skeleton/report-table-skeleton';

export function ReportSkeleton() {
  return (
    <div className='space-y-8 animate-in fade-in duration-300'>
      <ReportKpiSkeleton />
      <ReportChartsSkeleton />
      <ReportTableSkeleton />
    </div>
  );
}

export default ReportSkeleton;
