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

export function useReport() {
  const currentMonthStr = formatDate(new Date(), 'yyyy-MM');
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: rawMovements = [], isLoading, error, refetch } = useQuery({
    queryKey: ['report-movements'],
    queryFn: () => movementService.getAll(),
  });

  // Extract available month options
  const monthOptions = useMemo(() => {
    return getAvailableMonths(rawMovements);
  }, [rawMovements]);

  // If currentMonthStr is not in movement list, fall back gracefully if needed
  const activeMonth = useMemo(() => {
    if (selectedMonth === 'ALL') return 'ALL';
    const exists = monthOptions.some((m) => m.value === selectedMonth);
    if (!exists && monthOptions.length > 1) {
      return monthOptions[1].value; // First available month option after 'ALL'
    }
    return selectedMonth;
  }, [selectedMonth, monthOptions]);

  // Filter movements by selected month
  const monthlyMovements = useMemo(() => {
    return filterMovementsByMonth(rawMovements, activeMonth);
  }, [rawMovements, activeMonth]);

  // Calculate summary metrics
  const summary = useMemo(() => {
    return calculateReportSummary(monthlyMovements);
  }, [monthlyMovements]);

  // Calculate product breakdown
  const allProductReports = useMemo(() => {
    return calculateProductReport(monthlyMovements);
  }, [monthlyMovements]);

  // Filter products by search query
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

  const handleExportExcel = () => {
    exportReportToExcel(
      summary,
      filteredProductReports,
      monthlyMovements,
      activeMonthLabel,
    );
  };

  const handleExportCsv = () => {
    exportReportToCsv(filteredProductReports, activeMonthLabel);
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
  };
}
