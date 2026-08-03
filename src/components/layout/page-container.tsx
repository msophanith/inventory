import type { ReactNode } from 'react';

interface PageContainerProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly maxWidth?: 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
}

export function PageContainer({
  children,
  className = '',
  maxWidth = 'max-w-full',
}: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full min-w-0 ${maxWidth} px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6 ${className}`}
    >
      {children}
    </div>
  );
}

export default PageContainer;
