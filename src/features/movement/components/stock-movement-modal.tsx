import { useEffect } from 'react';
import { X } from 'lucide-react';

import StockMovementHeader from './stock-movement-header';
import MovementForm, { type FormValues } from './movement-form';
import type { MovementType } from '../../../services/movement';
import type { Product } from '../../../services/product';

interface Props {
  readonly open: boolean;
  readonly type: MovementType;
  readonly product: Product;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: FormValues) => void;
}


export default function StockMovementModal({
  open,
  type,
  product,
  loading,
  onClose,
  onSubmit,
}: Props) {

  useEffect(() => {
    document.body.style.overflow = open
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);


  if (!open) return null;


  return (
    <div
      className="
        fixed inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-md
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
          animate-in
          zoom-in-95
        "
      >

        <div className="relative">

          <StockMovementHeader
            type={type}
            product={product}
          />


          <button
            onClick={onClose}
            className="
              absolute
              right-5
              top-5
              rounded-full
              bg-white/20
              p-2
              text-white
              hover:bg-white/30
            "
          >
            <X size={18}/>
          </button>

        </div>


        <div className="max-h-[75vh] overflow-y-auto">
          <MovementForm
            type={type}
            product={product}
            loading={loading}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        </div>

      </div>

    </div>
  );
}