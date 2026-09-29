import { useEffect } from 'react';
import { telegramService } from '@/services';

const SENT_KEY = 'daily_report_sent_date';
const REPORT_HOUR = 20; // 20:00 local time

function getMsUntilReportTime(): number {
  const now = new Date();
  const target = new Date();
  target.setHours(REPORT_HOUR, 0, 0, 0);
  if (target <= now) {
    // Already past 20:00 — schedule for tomorrow
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

async function sendIfNotSentToday(): Promise<void> {
  const todayKey = new Date().toISOString().slice(0, 10);
  if (localStorage.getItem(SENT_KEY) === todayKey) return;
  const ok = await telegramService.sendDailySalesSummary();
  if (ok) localStorage.setItem(SENT_KEY, todayKey);
}

export function useDailySalesReport(): void {
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    function schedule() {
      const ms = getMsUntilReportTime();
      timerId = setTimeout(async () => {
        await sendIfNotSentToday();
        schedule(); // Re-schedule for the next day
      }, ms);
    }

    schedule();
    return () => clearTimeout(timerId);
  }, []);
}
