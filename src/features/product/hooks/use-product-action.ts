import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { gooeyToast } from 'goey-toast';

import { productService, movementService, type Product } from '@/services';
import type { ProductFormValues } from '@/features/product/schema/product.schema';
import { useAuth } from '@/features/auth/use-auth';

interface UpdateProductParams {
  id: string;
  data: ProductFormValues;
  previous?: Product | null;
}

const useProductAction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { mutate: onCreateProduct, isPending: isCreatingProduct } = useMutation({
    mutationFn: (payload: ProductFormValues) => productService.create(payload, user),

    onSuccess: async (product, variables) => {
      try {
        const initialQty = variables.quantity || 0;
        if (initialQty > 0) {
          await movementService.addMovement({
            id: uuidv4(),
            productId: product.id,
            type: 'IN',
            quantity: initialQty,
            note: 'Initial stock on product creation',
            unitPrice: product.buyPrice,
            isDamaged: false,
            reference: 'INITIAL_STOCK',
          });
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Stock creation failed';
        gooeyToast.error(message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs-kpi'] });
      navigate(`/products/${product.id}`);
    },

    onError: (error) => {
      gooeyToast.error(error.message);
    },
  });

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: ({ id, data, previous }: UpdateProductParams) =>
      productService.update(id, data, user, previous),

    onSuccess: async (product, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['activity-logs-kpi'] });
      navigate(`/products/${product.id}`);
    },

    onError: (error) => {
      gooeyToast.error(error.message);
    },
  });

  return {
    onCreateProduct,
    isCreatingProduct,
    updateProduct,
    isUpdatingProduct,
  };
};

export { useProductAction };
