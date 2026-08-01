import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { movementService } from '../../../services';
import type {
  Movement,
  MovementFilter,
  MovementType,
} from '../../../services/movement';
import { useState } from 'react';

const useMovement = (filters?: MovementFilter) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['movement', filters],
    queryFn: () => movementService.getAll(filters),
  });

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<MovementType>('IN');
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const useGetMovementById = (id: string) => {
    const { data, isLoading } = useQuery({
      queryKey: ['movement', id],
      queryFn: () => movementService.getMovementsByProductId(id),
      enabled: !!id,
    });

    return { data, isLoading };
  };

  const { mutateAsync: createMovement, isPending: isCreatingMovement } =
    useMutation({
      mutationFn: (product: Omit<Movement, 'createdAt'>) =>
        movementService.addMovement(product),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['movement'],
        });
        queryClient.invalidateQueries({
          queryKey: ['product'],
        });
      },
    });

  const { mutateAsync: updateMovement, isPending: isUpdatingMovement } =
    useMutation({
      mutationFn: (product: Partial<Movement>) =>
        movementService.addMovement(product),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['movement'],
        });
        queryClient.invalidateQueries({
          queryKey: ['product'],
        });
        setAlert({
          type: 'success',
          message: `Stock ${type}!`,
        });
      },
      onError: (error) => {
        setAlert({
          type: 'error',
          message: error?.message || 'Failed to update movement',
        });
      },
    });

  const { data: summary, isLoading: isGettingSummary } = useQuery({
    queryKey: ['today-sales'],
    queryFn: () => movementService.getTodaySale(),
  });

  return {
    data,
    isLoading,
    summary,
    isGettingSummary,
    useGetMovementById,
    createMovement,
    isCreatingMovement,
    open,
    type,
    setOpen,
    setType,
    updateMovement,
    isUpdatingMovement,
    alert,
    setAlert,

  };
};

export { useMovement };
