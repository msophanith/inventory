import { useState } from 'react';
import { ExportCenterModal } from './export-center-modal';
import { ExportPasswordModal } from './export-password-modal';

export type ExportType =
  | 'EXCEL'
  | 'MONTH_CSV'
  | 'TODAY_CSV'
  | 'PRODUCT_IN_EXCEL'
  | 'NEW_PRODUCT_EXCEL';

interface Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onExportExcel: (pwd?: string) => void;
  readonly onExportCsv: (pwd?: string) => void;
  readonly onExportTodayCsv: (pwd?: string) => void;
  readonly onExportProductInExcel: (pwd?: string) => void;
  readonly onExportNewProductExcel: (pwd?: string) => void;
}

export function ReportExportModals({
  isOpen,
  onClose,
  onExportExcel,
  onExportCsv,
  onExportTodayCsv,
  onExportProductInExcel,
  onExportNewProductExcel,
}: Props) {
  const [passwordModalState, setPasswordModalState] = useState<{
    isOpen: boolean;
    type: ExportType;
  }>({
    isOpen: false,
    type: 'EXCEL',
  });

  const handleOpenPasswordModal = (type: ExportType) => {
    setPasswordModalState({ isOpen: true, type });
  };

  const handleExecuteExport = (password?: string) => {
    const actions: Record<ExportType, (pwd?: string) => void> = {
      EXCEL: onExportExcel,
      MONTH_CSV: onExportCsv,
      TODAY_CSV: onExportTodayCsv,
      PRODUCT_IN_EXCEL: onExportProductInExcel,
      NEW_PRODUCT_EXCEL: onExportNewProductExcel,
    };
    actions[passwordModalState.type]?.(password);
  };

  return (
    <>
      <ExportCenterModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectExport={handleOpenPasswordModal}
      />

      <ExportPasswordModal
        isOpen={passwordModalState.isOpen}
        onClose={() =>
          setPasswordModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onExport={handleExecuteExport}
        exportType={passwordModalState.type}
      />
    </>
  );
}
