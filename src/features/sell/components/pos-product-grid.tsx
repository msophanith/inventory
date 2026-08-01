import { useMemo, useState } from 'react';
import { Camera, Search } from 'lucide-react';
import type { Product } from '../../../services/product';
import type { CartItem } from '../types/sell.types';
import { PosProductCard } from './pos-product-card';

interface Props {
  readonly products: Product[];
  readonly cartItems: CartItem[];
  readonly isLoading?: boolean;
  readonly onAddToCart: (product: Product) => void;
  readonly onOpenScanModal: () => void;
}

export function PosProductGrid({
  products,
  cartItems,
  isLoading,
  onAddToCart,
  onOpenScanModal,
}: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.category && set.add(p.category));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode?.includes(search);
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach((i) => map.set(i.product.id, i.quantity));
    return map;
  }, [cartItems]);

  return (
    <div className='space-y-4 flex-1 min-w-0 w-full max-w-full'>
      {/* Controls Container: Search & Camera Scan Bar */}
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search products or scan barcode...'
              className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs'
            />
          </div>

          <button
            onClick={onOpenScanModal}
            title='Scan with Phone / Camera'
            className='flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer shrink-0'
          >
            <Camera size={16} />
            <span className='hidden sm:inline'>Scan Camera</span>
          </button>
        </div>

        {/* Category Pills Bar (Horizontal Scrollable) */}
        <div className='flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 w-full max-w-full scrollbar-hide'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className='grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className='h-52 animate-pulse rounded-3xl bg-slate-200/70'
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className='flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400'>
          <p className='font-semibold text-slate-600'>No products found</p>
          <p className='text-xs mt-1 text-slate-400'>
            Try searching for a different product name or scanning barcode.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {filteredProducts.map((p) => (
            <PosProductCard
              key={p.id}
              product={p}
              cartQuantity={cartMap.get(p.id) || 0}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
