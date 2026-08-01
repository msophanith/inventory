import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

const QUICK_VALUES = [1, 5, 10, 20];

export default function QuantityStepper({ value, onChange }: Props) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center rounded-2xl border'>
        <button
          type='button'
          onClick={() => onChange(Math.max(1, value - 1))}
          className='p-4 hover:bg-gray-100'
        >
          <Minus size={18} />
        </button>

        <input
          type='number'
          min={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value)))}
          className='flex-1 text-center text-3xl font-bold outline-none'
        />

        <button
          type='button'
          onClick={() => onChange(value + 1)}
          className='p-4 hover:bg-gray-100'
        >
          <Plus size={18} />
        </button>
      </div>

      <div className='flex flex-wrap gap-2'>
        {QUICK_VALUES.map((item) => (
          <button
            key={item}
            type='button'
            onClick={() => onChange(value + item)}
            className='rounded-xl border px-4 py-2 text-sm hover:bg-gray-100'
          >
            +{item}
          </button>
        ))}
      </div>
    </div>
  );
}
