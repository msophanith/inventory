import { useQuery } from '@tanstack/react-query';
import { activityLogService } from '@/services';
import { useActivityLogStore } from '../store/use-activity-log-store';

export function useActivityLogs() {
  const search = useActivityLogStore((state) => state.search);
  const actionFilter = useActivityLogStore((state) => state.actionFilter);
  const dateRange = useActivityLogStore((state) => state.dateRange);
  const currentPage = useActivityLogStore((state) => state.currentPage);

  const {
    data: logsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['activity-logs', { search, actionFilter, dateRange, currentPage }],
    queryFn: () =>
      activityLogService.getAll({
        page: currentPage,
        limit: 15,
        search,
        action: actionFilter,
        dateRange,
      }),
    staleTime: 10 * 1000,
  });

  const { data: kpiData, isLoading: isKpiLoading } = useQuery({
    queryKey: ['activity-logs-kpi'],
    queryFn: () => activityLogService.getKPIs(),
    staleTime: 30 * 1000,
  });

  return {
    logs: logsResponse?.data ?? [],
    totalCount: logsResponse?.count ?? 0,
    totalPages: logsResponse?.totalPages ?? 1,
    page: logsResponse?.page ?? 1,
    limit: logsResponse?.limit ?? 15,
    isLoading,
    isFetching,
    refetch,
    kpis: kpiData ?? {
      totalLogs: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalDeleted: 0,
    },
    isKpiLoading,
  };
}
