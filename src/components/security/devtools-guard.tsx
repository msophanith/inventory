import { useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDevToolsDetector } from './use-devtools-detector';
import { DevToolsBlockedView } from './devtools-blocked-view';
import { setNetworkBlocked } from './network-guard';

interface Props {
  readonly children: ReactNode;
}

export function DevToolsGuard({ children }: Props) {
  const { isOpen, setIsOpen } = useDevToolsDetector();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      setNetworkBlocked(true);
      queryClient.cancelQueries();
    } else {
      setNetworkBlocked(false);
    }
  }, [isOpen, queryClient]);

  if (isOpen) {
    return (
      <DevToolsBlockedView
        onBypass={() => {
          setNetworkBlocked(false);
          setIsOpen(false);
        }}
      />
    );
  }

  return <>{children}</>;
}

export default DevToolsGuard;
