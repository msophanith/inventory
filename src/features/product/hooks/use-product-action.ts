import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import { productService } from '../../../services';
import { useMovement } from '../../movement/hooks/use-movement';
import type { ProductFormValues } from '../schema/product.schema';
import { useProductStore } from '../store/use-product-store';

const useProductAction = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { createMovement } = useMovement();

  const alert = useProductStore((state) => state.alert);
  const setAlert = useProductStore((state) => state.setAlert);

  const { mutate: onCreateProduct, isPending: isCreatingProduct } = useMutation(
    {
      mutationFn: (payload: ProductFormValues) =>
        productService.create(payload),

      onSuccess: async (product, variables) => {
        try {
          const initialQty = variables.quantity || 0;
          if (initialQty > 0) {
            await createMovement({
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
        } catch (err: any) {
          setAlert({
            type: 'error',
            message: err.message,
          });

          return;
        }

        queryClient.invalidateQueries({
          queryKey: ['products'],
        });

        queryClient.invalidateQueries({
          queryKey: ['movements'],
        });
        navigate(`/products/${product.id}`);
      },

      onError: (error) => {
        setAlert({
          type: 'error',
          message: error.message,
        });
      },
    },
  );

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormValues }) =>
      productService.update(id, data),

    onSuccess: async (product, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });

      queryClient.invalidateQueries({
        queryKey: ['product', variables.id],
      });
      navigate(`/products/${product.id}`);
    },

    onError: (error) => {
      setAlert({
        type: 'error',
        message: error.message,
      });
    },
  });

  return {
    onCreateProduct,
    isCreatingProduct,
    updateProduct,
    isUpdatingProduct,
    alert,
    setAlert,
  };
};

export { useProductAction };
