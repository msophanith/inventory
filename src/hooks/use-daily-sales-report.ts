import { useEffect, useCallback } from 'react';
import { telegramService } from '@/services';

export const DAILY_REPORT_SENT_KEY = 'daily_report_sent_date';
export const DEFAULT_REPORT_HOUR = 20; // 20:00 local time (8:00 PM)

export function getLocalDateKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getReportHour(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_REPORT_HOUR;
  const saved = localStorage.getItem('daily_report_hour');
  const parsed = saved ? Number.parseInt(saved, 10) : NaN;
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 23
    ? parsed
    : DEFAULT_REPORT_HOUR;
}

export async function sendDailyReportNow(targetDate: Date = new Date()): Promise<boolean> {
  const ok = await telegramService.sendDailySalesSummary(targetDate);
  if (ok && typeof localStorage !== 'undefined') {
    localStorage.setItem(DAILY_REPORT_SENT_KEY, getLocalDateKey(targetDate));
  }
  return ok;
}

export function useDailySalesReport(): {
  sendReportNow: (date?: Date) => Promise<boolean>;
} {
  const checkAndDispatch = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const now = new Date();
    const currentHour = now.getHours();
    const reportHour = getReportHour();
    const todayKey = getLocalDateKey(now);
    const lastSent = localStorage.getItem(DAILY_REPORT_SENT_KEY);

    // 1. If it's on or past the report hour today and not yet sent
    if (currentHour >= reportHour && lastSent !== todayKey) {
      await sendDailyReportNow(now);
      return;
    }

    // 2. Catch up for yesterday's missed report if store closed before report hour
    if (currentHour < reportHour) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayKey = getLocalDateKey(yesterday);

      if (lastSent !== yesterdayKey && lastSent !== todayKey) {
        await sendDailyReportNow(yesterday);
      }
    }
  }, []);

  useEffect(() => {
    // Check immediately on mount
    void checkAndDispatch();

    // Check periodically every 60 seconds
    const intervalId = setInterval(() => {
      void checkAndDispatch();
    }, 60_000);

    // Check whenever tab becomes active or window gains focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void checkAndDispatch();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [checkAndDispatch]);

  return { sendReportNow: sendDailyReportNow };
}
