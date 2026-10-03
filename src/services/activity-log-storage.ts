import type { ActivityLog } from './activity-log.types';

const STORAGE_KEY = 'meanleap_activity_logs_backup';

export class ActivityLogStorage {
  static getLocalLogs(): ActivityLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as ActivityLog[];
    } catch {
      return [];
    }
  }

  static saveLocalLog(log: ActivityLog): void {
    try {
      const existing = this.getLocalLogs();
      const updated = [log, ...existing.filter((item) => item.id !== log.id)].slice(0, 500);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('[ActivityLogStorage] Failed to save local log:', err);
    }
  }

  static clearLocalLogs(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('[ActivityLogStorage] Failed to clear local logs:', err);
    }
  }
}
