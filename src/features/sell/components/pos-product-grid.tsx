import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { BoxIcon } from 'lucide-react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useLanguage } from '../../../i18n/language-context';
import type { Product } from '../../../services/product';
import type { CartItem } from '../types/sell.types';
import { PosProductCard } from './pos-product-card';
import { PosFilterBar } from './pos-filter-bar';
import { useProduct } from '../../product/hooks/use-product';

interface Props {
  readonly products: Product[];
  readonly cartItems: CartItem[];
  readonly isLoading?: boolean;
  readonly search: string;
  readonly onSearchChange: (val: string) => void;
  readonly selectedCategory: string;
  readonly onCategoryChange: (cat: string) => void;
  readonly onAddToCart: (product: Product) => void;
  readonly onOpenScanModal: () => void;
}

export function PosProductGrid({
  products,
  cartItems,
  isLoading,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  onOpenScanModal,
}: Props) {
  const { t } = useLanguage();
  const { useGetCategories } = useProduct();
  const { data: dynamicCategories = [] } = useGetCategories();

  const categories = useMemo(() => [t('common.all'), ...dynamicCategories], [dynamicCategories, t]);
  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach((i) => map.set(i.product.id, i.quantity));
    return map;
  }, [cartItems]);

  const listRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(2);
  const [listOffset, setListOffset] = useState(0);

  useLayoutEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width >= 1536) setColumns(5);
      else if (width >= 1280) setColumns(4);
      else if (width >= 480) setColumns(3);
      else setColumns(2);

      if (listRef.current) {
        setListOffset(listRef.current.getBoundingClientRect().top + window.scrollY);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [products.length]);

  const rowCount = Math.ceil(products.length / columns);
  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 240,
    overscan: 4,
    scrollMargin: listOffset,
  });

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[columns] || 'grid-cols-2';

  const items = rowVirtualizer.getVirtualItems();

  return (
    <div className='space-y-3.5 flex-1 min-w-0 w-full max-w-full'>
      <PosFilterBar
        search={search}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
        onOpenScanModal={onOpenScanModal}
      />

      {isLoading ? (
        <div className={`grid gap-2.5 sm:gap-3 ${gridColsClass}`}>
          {[...Array(columns * 2)].map((_, i) => (
            <div key={i} className='h-48 sm:h-52 animate-pulse rounded-3xl bg-slate-200/70' />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className='flex h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-400 space-y-2'>
          <BoxIcon size={28} className='text-slate-300' />
          <p className='font-bold text-slate-700 text-sm'>{t('pos.noProductsFound')}</p>
          <p className='text-xs text-slate-400'>{t('pos.tryAdjusting')}</p>
        </div>
      ) : (
        <div ref={listRef} className='relative w-full' style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          {items.map((virtualRow) => {
            const startIndex = virtualRow.index * columns;
            const rowProducts = products.slice(startIndex, startIndex + columns);

            return (
              <div
                key={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                data-index={virtualRow.index}
                className={`absolute top-0 left-0 w-full grid gap-2.5 sm:gap-3 ${gridColsClass}`}
                style={{
                  transform: `translateY(${virtualRow.start - listOffset}px)`,
                  paddingBottom: '12px',
                }}
              >
                {rowProducts.map((p) => (
                  <PosProductCard
                    key={p.id}
                    product={p}
                    cartQuantity={cartMap.get(p.id) || 0}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
