import { useMemo, useState } from 'react';
import { Camera, Search, Sparkles } from 'lucide-react';
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
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (p.category) {
        map.set(p.category, (map.get(p.category) || 0) + 1);
      }
    });
    return [
      { name: 'ALL', count: products.length },
      ...Array.from(map.entries()).map(([name, count]) => ({ name, count })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
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
      {/* Controls: Search Bar & Camera Button */}
      <div className='space-y-3 w-full min-w-0'>
        <div className='flex items-center gap-2 w-full min-w-0'>
          <div className='relative flex-1 min-w-0'>
            <Search size={18} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400' />
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search by product name or barcode...'
              className='w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs transition-all'
            />
          </div>

          <button
            onClick={onOpenScanModal}
            title='Scan with Camera'
            className='flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer shrink-0 active:scale-95'
          >
            <Camera size={16} />
            <span className='hidden sm:inline'>Scan Camera</span>
          </button>
        </div>

        {/* Category Pills Bar (Horizontal Scrollable with Item Count Badges) */}
        <div className='flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 w-full max-w-full scrollbar-hide'>
          {categories.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${active ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className='grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className='h-52 animate-pulse rounded-3xl bg-slate-200/70' />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className='flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 space-y-2'>
          <Sparkles size={32} className='text-slate-300' />
          <p className='font-bold text-slate-700 text-sm'>No matching products found</p>
          <p className='text-xs text-slate-400'>Try adjusting search terms or category selection.</p>
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
