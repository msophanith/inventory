import { useDailySalesReport } from "../hooks/use-daily-sales-report";

export function DailyReportScheduler() {
  useDailySalesReport();
  return null;
}
