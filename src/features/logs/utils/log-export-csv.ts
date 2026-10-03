import type { ActivityLog } from '@/services/activity-log.types';
import { formatDate } from '@/utils/date';

export function exportActivityLogsToCSV(logs: ActivityLog[]): void {
  if (!logs || logs.length === 0) return;

  const headers = [
    'Timestamp',
    'Action',
    'Product Name',
    'Barcode',
    'User Name',
    'User Email',
    'User Role',
    'Summary',
  ];

  const rows = logs.map((log) => {
    const time = formatDate(log.createdAt, 'DD/MM/YYYY HH:mm:ss');
    const action = log.action;
    const name = `"${(log.entityName || '').replace(/"/g, '""')}"`;
    const barcode = `"${(log.barcode || '').replace(/"/g, '""')}"`;
    const user = `"${(log.userName || '').replace(/"/g, '""')}"`;
    const email = `"${(log.userEmail || '').replace(/"/g, '""')}"`;
    const role = log.userRole || '';
    const summary = `"${(log.details?.summary || '').replace(/"/g, '""')}"`;

    return [time, action, name, barcode, user, email, role, summary].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Product_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
