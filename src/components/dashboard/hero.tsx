import { CalendarDays } from 'lucide-react';

export default function Hero() {
  const now = new Date();

  const greeting =
    now.getHours() < 12
      ? 'Good Morning'
      : now.getHours() < 18
        ? 'Good Afternoon'
        : 'Good Evening';

  return (
    <section className='relative overflow-hidden rounded-3xl bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600 p-10 text-white shadow-xl'>
      <div className='absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl' />

      <div className='absolute -bottom-10 left-0 h-32 w-32 rounded-full bg-white/10 blur-2xl' />

      <div className='relative z-10'>
        <p className='text-lg opacity-80'>{greeting} 👋</p>

        <h1 className='mt-3 text-5xl font-black'>
          Track.
        <br />
          Manage.
          <br />
          Grow.
        </h1>

        <p className='mt-6 max-w-lg text-indigo-100'>
          Everything you need to manage your stock in one place.
        </p>

        <div className='mt-8 flex items-center gap-3 text-indigo-100'>
          <CalendarDays size={18} />
          {now.toDateString()}
        </div>
      </div>
    </section>
  );
}
