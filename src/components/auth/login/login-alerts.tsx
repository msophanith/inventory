interface LoginAlertsProps {
  readonly serverError: string | null;
}

export function LoginAlerts({ serverError }: LoginAlertsProps) {
  if (!serverError) return null;

  return (
    <div className='mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300'>
      {serverError}
    </div>
  );
}
