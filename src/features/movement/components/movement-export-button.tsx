import { useState } from 'react';
import { FileDown } from 'lucide-react';
import type { Movement } from '@/services/movement';
import { exportMovementsToExcel } from '../utils/movement-export';

interface Props {
  readonly movements: Movement[];
  readonly filename?: string;
}

export function MovementExportButton({ movements, filename }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting || movements.length === 0) return;
    setExporting(true);
    try {
      exportMovementsToExcel(movements, filename);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type='button'
      onClick={handleExport}
      disabled={exporting || movements.length === 0}
      title={
        movements.length === 0
          ? 'No data to export'
          : `Export ${movements.length} rows to Excel`
      }
      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
        ${
          movements.length === 0
            ? 'opacity-40 cursor-not-allowed bg-emerald-50 text-emerald-700 border-emerald-200'
            : exporting
              ? 'bg-emerald-600 text-white border-emerald-600 animate-pulse'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 active:scale-95'
        }`}
    >
      <FileDown size={14} />
      <span>{exporting ? 'Exporting…' : `Export (${movements.length})`}</span>
    </button>
  );
}
