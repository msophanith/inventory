import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movement } from '@/services/movement';
import { isYesterday, isWithinLastNDays, isSameMonth } from '@/utils/date';
import { MovementTableFilter } from './movement-table-filter';
import { MovementTablePagination } from './movement-table-pagination';
import { MovementTableBanner } from './movement-table-banner';
import { MovementExportButton } from './movement-export-button';
import { MovementMobileCard } from './movement-mobile-card';
import { MovementTableDesktop } from './movement-table-desktop';
import { getMovementMonthOptions } from '../utils/movement-month';
import { useMovementStore } from '@/features/movement/store/use-movement-store';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly movements: Movement[];
  readonly isLoading?: boolean;
  readonly onRowClick?: (productId: string) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const MovementTable = ({ movements, isLoading, onRowClick }: Props) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    filterType: type,
    setFilterType: setType,
    selectedMonth,
    setSelectedMonth,
    dateRange,
    setDateRange,
    damagedOnly,
    setDamagedOnly,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useMovementStore();

  const monthOptions = useMemo(() => getMovementMonthOptions(movements), [movements]);

  const activeMonthLabel = useMemo(() => {
    if (selectedMonth === 'ALL') return t('reports.allMonths') || 'All Months';
    const opt = monthOptions.find((m) => m.value === selectedMonth);
    return opt ? opt.label : selectedMonth;
  }, [selectedMonth, monthOptions, t]);

  const filteredMovements = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return movements.filter((item) => {
      if (!isSameMonth(item.createdAt, selectedMonth)) return false;
      if (dateRange === 'YESTERDAY' && !isYesterday(item.createdAt)) return false;
      if (dateRange === 'LAST_7' && !isWithinLastNDays(item.createdAt, 7)) return false;
      if (dateRange === 'LAST_15' && !isWithinLastNDays(item.createdAt, 15)) return false;
      if (type !== 'ALL' && item.type !== type) return false;
      const isDamaged = Boolean(item.isDamaged || item.reference?.toLowerCase() === 'damage');
      if (damagedOnly && !isDamaged) return false;
      if (!q) return true;
      return (
        item.product?.name?.toLowerCase().includes(q) ||
        item.reference?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [movements, selectedMonth, type, dateRange, damagedOnly, searchQuery]);

  const totalPages = Math.ceil(filteredMovements.length / pageSize) || 1;
  const paginatedData = filteredMovements.slice((page - 1) * pageSize, page * pageSize);

  const handleRowClick = (productId: string) => {
    if (!productId) return;
    if (onRowClick) onRowClick(productId);
    else navigate(`/products/${productId}`);
  };

  return (
    <div className='space-y-4 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs w-full overflow-hidden'>
      <MovementTableBanner monthLabel={activeMonthLabel} />

      <MovementTableFilter
        selectedType={type}
        onTypeChange={setType}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        monthOptions={monthOptions}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        damagedOnly={damagedOnly}
        onToggleDamaged={() => setDamagedOnly(!damagedOnly)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        exportButton={<MovementExportButton movements={filteredMovements} filename='movements' />}
      />

      {/* ── Mobile: card list ── */}
      <div className='flex flex-col gap-3 sm:hidden'>
        {isLoading ? (
          <p className='p-8 text-center text-slate-400 font-medium'>{t('movement.loadingMovements')}</p>
        ) : paginatedData.length === 0 ? (
          <p className='p-8 text-center text-slate-500 font-medium'>
            {t('movement.noMovementsFound', { month: activeMonthLabel })}
          </p>
        ) : (
          paginatedData.map((item) => (
            <MovementMobileCard
              key={item.id}
              item={item}
              onClick={() => handleRowClick(item.productId || item.product?.id || '')}
            />
          ))
        )}
      </div>

      {/* ── Desktop: table ── */}
      <MovementTableDesktop
        movements={paginatedData}
        isLoading={isLoading}
        monthLabel={activeMonthLabel}
        onRowClick={handleRowClick}
      />

      <MovementTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={filteredMovements.length}
        pageSize={pageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default MovementTable;
