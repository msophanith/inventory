import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movementService } from '../../../services';
import { formatDate } from '../../../utils/date';
import {
  calculateProductReport,
  calculateReportSummary,
  filterMovementsByMonth,
  getAvailableMonths,
} from '../utils/report-calculator';
import { exportReportToCsv, exportReportToExcel } from '../utils/excel-export';
import { exportTodaySalesToCsv } from '../utils/today-sales-export';

export function useReport() {
  const currentMonthStr = formatDate(new Date(), 'yyyy-MM');
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: rawMovements = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['report-movements'],
    queryFn: () => movementService.getAll(),
  });

  const monthOptions = useMemo(() => {
    return getAvailableMonths(rawMovements);
  }, [rawMovements]);

  const activeMonth = useMemo(() => {
    if (selectedMonth === 'ALL') return 'ALL';
    const exists = monthOptions.some((m) => m.value === selectedMonth);
    if (!exists && monthOptions.length > 1) {
      return monthOptions[1].value;
    }
    return selectedMonth;
  }, [selectedMonth, monthOptions]);

  const monthlyMovements = useMemo(() => {
    return filterMovementsByMonth(rawMovements, activeMonth);
  }, [rawMovements, activeMonth]);

  const summary = useMemo(() => {
    return calculateReportSummary(monthlyMovements);
  }, [monthlyMovements]);

  const allProductReports = useMemo(() => {
    return calculateProductReport(monthlyMovements);
  }, [monthlyMovements]);

  const filteredProductReports = useMemo(() => {
    if (!searchQuery.trim()) return allProductReports;
    const query = searchQuery.toLowerCase();
    return allProductReports.filter(
      (p) =>
        p.productName.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query),
    );
  }, [allProductReports, searchQuery]);

  const activeMonthLabel = useMemo(() => {
    const found = monthOptions.find((m) => m.value === activeMonth);
    return found ? found.label : activeMonth;
  }, [monthOptions, activeMonth]);

  const handleExportExcel = (password?: string) => {
    exportReportToExcel(
      summary,
      filteredProductReports,
      monthlyMovements,
      activeMonthLabel,
      password,
    );
  };

  const handleExportCsv = (password?: string) => {
    exportReportToCsv(filteredProductReports, activeMonthLabel, password);
  };

  const handleExportTodayCsv = (password?: string) => {
    exportTodaySalesToCsv(rawMovements, password);
  };

  return {
    isLoading,
    error,
    refetch,
    selectedMonth: activeMonth,
    setSelectedMonth,
    searchQuery,
    setSearchQuery,
    monthOptions,
    activeMonthLabel,
    summary,
    productReports: filteredProductReports,
    monthlyMovements,
    handleExportExcel,
    handleExportCsv,
    handleExportTodayCsv,
  };
}
