import type { ActivityLog } from '@/services/activity-log.types';
import { useActivityLogs } from '../hooks/use-activity-logs';
import { useActivityLogStore } from '../store/use-activity-log-store';
import { LogKpiCards } from './log-kpi-cards';
import { LogTableFilter } from './log-table-filter';
import { LogTableDesktop } from './log-table-desktop';
import { LogMobileCard } from './log-mobile-card';
import { LogTablePagination } from './log-table-pagination';
import { LogDiffModal } from './log-diff-modal';

export function ActivityLogTable() {
  const {
    logs,
    totalCount,
    totalPages,
    page,
    limit,
    isLoading,
    isFetching,
    refetch,
    kpis,
    isKpiLoading,
  } = useActivityLogs();

  const selectedLog = useActivityLogStore((state) => state.selectedLog);
  const setSelectedLog = useActivityLogStore((state) => state.setSelectedLog);
  const isDiffModalOpen = useActivityLogStore((state) => state.isDiffModalOpen);
  const setIsDiffModalOpen = useActivityLogStore((state) => state.setIsDiffModalOpen);

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsDiffModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDiffModalOpen(false);
    setSelectedLog(null);
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Top Metric Cards */}
      <LogKpiCards kpis={kpis} isLoading={isKpiLoading} />

      {/* Filter and Search Bar */}
      <LogTableFilter
        allLogs={logs}
        isFetching={isFetching}
        onRefresh={() => refetch()}
      />

      {/* Desktop Table View */}
      <LogTableDesktop
        logs={logs}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Mobile Card View */}
      <LogMobileCard
        logs={logs}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination Footer */}
      <LogTablePagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
      />

      {/* Log Diff Details Modal */}
      <LogDiffModal
        log={selectedLog}
        open={isDiffModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
