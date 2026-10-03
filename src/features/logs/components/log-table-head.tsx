export function LogTableHead() {
  return (
    <thead className='bg-slate-50/80 border-b border-slate-200/80'>
      <tr>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          Action
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          Product
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          Change Details
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          Performed By
        </th>
        <th className='px-4 py-3.5 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          Date & Time
        </th>
        <th className='px-4 py-3.5 text-right text-[11px] font-extrabold uppercase tracking-wider text-slate-500'>
          Action
        </th>
      </tr>
    </thead>
  );
}
