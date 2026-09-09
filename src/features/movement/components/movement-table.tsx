import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movement } from '../../../services/movement';
import { getCurrentMonthLabel, isCurrentMonth } from '../../../utils/date';
import { MovementTableFilter } from './movement-table-filter';
import { MovementTablePagination } from './movement-table-pagination';
import { MovementTableRow } from './movement-table-row';
import { MovementTableHead } from './movement-table-head';
import { MovementTableBanner } from './movement-table-banner';
import { useMovementStore } from '../store/use-movement-store';
import { useLanguage } from '../../../i18n/language-context';

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
    damagedOnly,
    setDamagedOnly,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useMovementStore();

  const currentMonthLabel = useMemo(() => getCurrentMonthLabel(), []);

  const filteredMovements = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return movements.filter((item) => {
      if (!isCurrentMonth(item.createdAt)) return false;
      if (type !== 'ALL' && item.type !== type) return false;
      const isDamaged = Boolean(
        item.isDamaged || item.reference?.toLowerCase() === 'damage',
      );
      if (damagedOnly && !isDamaged) return false;
      if (!q) return true;
      return (
        item.product?.name?.toLowerCase().includes(q) ||
        item.reference?.toLowerCase().includes(q) ||
        item.note?.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [movements, type, damagedOnly, searchQuery]);

  const totalPages = Math.ceil(filteredMovements.length / pageSize) || 1;
  const paginatedData = filteredMovements.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handleRowClick = (productId: string) => {
    if (!productId) return;
    if (onRowClick) {
      onRowClick(productId);
    } else {
      navigate(`/products/${productId}`);
    }
  };

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7} className='p-10 text-center text-slate-400 font-medium'>
            {t('movement.loadingMovements')}
          </td>
        </tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan={7} className='p-12 text-center text-slate-500 font-medium'>
            {t('movement.noMovementsFound', { month: currentMonthLabel })}
          </td>
        </tr>
      );
    }

    return paginatedData.map((item) => (
      <MovementTableRow
        key={item.id}
        item={item}
        onClick={() => handleRowClick(item.productId || item.product?.id || '')}
      />
    ));
  };

  return (
    <div className='space-y-6 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs min-w-0 w-full max-w-full overflow-hidden'>
      <MovementTableBanner monthLabel={currentMonthLabel} />

      <MovementTableFilter
        selectedType={type}
        onTypeChange={setType}
        damagedOnly={damagedOnly}
        onToggleDamaged={() => setDamagedOnly(!damagedOnly)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className='overflow-x-auto rounded-2xl border border-slate-100 min-w-0 w-full'>
        <table className='w-full border-collapse text-left text-sm'>
          <MovementTableHead />
          <tbody className='divide-y divide-slate-100'>
            {renderTableBody()}
          </tbody>
        </table>
      </div>

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

