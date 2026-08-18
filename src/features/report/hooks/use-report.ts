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
import type { Movement } from '../../../services/movement';

export type DateMode = 'MONTH' | 'RANGE';

function filterByDateRange(movements: Movement[], start: string, end: string): Movement[] {
  if (!start || !end) return movements;
  const from = new Date(start).getTime();
  const to = new Date(end + 'T23:59:59').getTime();
  return movements.filter((m) => {
    const t = new Date(m.createdAt).getTime();
    return t >= from && t <= to;
  });
}

export function useReport() {
  const currentMonthStr = formatDate(new Date(), 'yyyy-MM');
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateMode, setDateMode] = useState<DateMode>('MONTH');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

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
    if (dateMode === 'RANGE') return filterByDateRange(rawMovements, customStart, customEnd);
    return filterMovementsByMonth(rawMovements, activeMonth);
  }, [rawMovements, activeMonth, dateMode, customStart, customEnd]);

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
    if (dateMode === 'RANGE' && customStart && customEnd) return `${customStart} → ${customEnd}`;
    const found = monthOptions.find((m) => m.value === activeMonth);
    return found ? found.label : activeMonth;
  }, [monthOptions, activeMonth, dateMode, customStart, customEnd]);

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
  };
}
