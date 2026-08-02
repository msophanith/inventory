interface Props {
  readonly label?: string;
  readonly name: string;
  readonly register: any;
  readonly error?: string;
  readonly type?: string;
  readonly required?: boolean;
  readonly isHidden?: boolean;
  readonly prefix?: string;
  readonly rightElement?: React.ReactNode;
  readonly step?: string | number;
}

const FormInput = ({
  label,
  name,
  register,
  error,
  type = 'text',
  required = false,
  isHidden = false,
  prefix,
  rightElement,
  step,
}: Props) => {
  if (isHidden) {
    return <input {...register(name)} type='hidden' />;
  }

  return (
    <div className='space-y-1.5 min-w-0 w-full'>
      {label && (
        <label className='block text-xs font-bold uppercase tracking-wider text-slate-600'>
          {label}
          {required && <span className='ml-1 text-rose-500'>*</span>}
        </label>
      )}

      <div className='relative flex items-center min-w-0 w-full'>
        {prefix && (
          <span className='absolute left-3.5 text-sm font-bold text-slate-400 pointer-events-none'>
            {prefix}
          </span>
        )}

        <input
          {...register(name)}
          type={type}
          step={step}
          className={`h-11 w-full rounded-2xl border text-sm font-semibold text-slate-900 transition focus:outline-none focus:ring-2 ${
            prefix ? 'pl-8' : 'pl-4'
          } ${rightElement ? 'pr-12' : 'pr-4'} ${
            error
              ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />

        {rightElement && (
          <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center'>
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className='text-xs font-medium text-rose-500'>{error}</p>}
    </div>
  );
};

export default FormInput;
