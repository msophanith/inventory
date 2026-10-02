import type { Movement } from '@/services/movement';
import { MovementTableHead } from './movement-table-head';
import { MovementTableRow } from './movement-table-row';
import { useLanguage } from '@/i18n/language-context';

interface Props {
  readonly movements: Movement[];
  readonly isLoading?: boolean;
  readonly monthLabel: string;
  readonly onRowClick: (productId: string) => void;
}

export function MovementTableDesktop({
  movements,
  isLoading,
  monthLabel,
  onRowClick,
}: Props) {
  const { t } = useLanguage();

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={7} className='p-10 text-center text-slate-400 font-medium'>
            {t('movement.loadingMovements')}
          </td>
        </tr>
      );
    }

    if (movements.length === 0) {
      return (
        <tr>
          <td colSpan={7} className='p-12 text-center text-slate-500 font-medium'>
            {t('movement.noMovementsFound', { month: monthLabel })}
          </td>
        </tr>
      );
    }

    return movements.map((item) => (
      <MovementTableRow
        key={item.id}
        item={item}
        onClick={() => onRowClick(item.productId || item.product?.id || '')}
      />
    ));
  };

  return (
    <div className='hidden sm:block overflow-x-auto rounded-2xl border border-slate-100 w-full'>
      <table className='w-full border-collapse text-left text-sm'>
        <MovementTableHead />
        <tbody className='divide-y divide-slate-100'>{renderContent()}</tbody>
      </table>
    </div>
  );
}
