import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { Camera, Search, Sparkles } from 'lucide-react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { Product } from '../../../services/product';
import type { CartItem } from '../types/sell.types';
import { PosProductCard } from './pos-product-card';
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
  const { useGetCategories } = useProduct();
  const { data: dynamicCategories = [] } = useGetCategories();

  const categories = useMemo(() => {
    return ['ALL', ...dynamicCategories];
  }, [dynamicCategories]);

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
      if (width >= 1536) setColumns(5); // 2xl
      else if (width >= 1280) setColumns(4); // xl
      else if (width >= 480) setColumns(3); // min-480, sm, md
      else setColumns(2);

      if (listRef.current) {
        setListOffset(listRef.current.getBoundingClientRect().top + window.scrollY);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [products.length]); // Recalculate if products change and cause layout shifts

  const rowCount = Math.ceil(products.length / columns);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 240, // Approximate row height including gap
    overscan: 4,
    scrollMargin: listOffset,
  });

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  }[columns] || 'grid-cols-2';

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={`grid gap-3 ${gridColsClass}`}>
          {[...Array(columns * 2)].map((_, i) => (
            <div
              key={i}
              className='h-52 animate-pulse rounded-3xl bg-slate-200/70'
            />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className='flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 space-y-2'>
          <Sparkles size={32} className='text-slate-300' />
          <p className='font-bold text-slate-700 text-sm'>
            No matching products found
          </p>
          <p className='text-xs text-slate-400'>
            Try adjusting your search query or category selection.
          </p>
        </div>
      );
    }

    const items = rowVirtualizer.getVirtualItems();

    return (
      <div 
        ref={listRef} 
        className='relative w-full' 
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {items.map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowProducts = products.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              className={`absolute top-0 left-0 w-full grid gap-3 ${gridColsClass}`}
              style={{
                transform: `translateY(${virtualRow.start - listOffset}px)`,
                paddingBottom: '12px', // gap between rows
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
    );
  };

  return (
    <div className='space-y-4 flex-1 min-w-0 w-full max-w-full'>
      {/* Controls: Search Bar & Camera Button */}
      <div className='space-y-3 w-full min-w-0'>
        <div className='flex items-center gap-2 w-full min-w-0'>
          <div className='relative flex-1 min-w-0'>
            <Search
              size={18}
              className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
            />
            <input
              type='text'
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder='Search 2,000+ products by name or barcode...'
              className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs transition-all'
            />
          </div>

          <button
            onClick={onOpenScanModal}
            title='Scan with Camera'
            className='flex items-center gap-1.5 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer shrink-0 active:scale-95'
          >
            <Camera size={16} />
            <span className='hidden sm:inline'>Scan Camera</span>
          </button>
        </div>

        {/* Dynamic Category Pills Bar */}
        <div className='flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 w-full max-w-full scrollbar-hide'>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid View */}
      {renderContent()}
    </div>
  );
}
