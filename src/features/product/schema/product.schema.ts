import * as yup from 'yup';

export const productSchema = yup.object({
  id: yup.string().default(''),
  name: yup.string().required('Product name is required'),
  description: yup.string().default(''),
  barcode: yup.string().required('Barcode is required'),
  category: yup.string().required('Category is required'),
  buyPrice: yup
    .number()
    .typeError('Buy price must be a number')
    .required('Buy price is required')
    .min(0),
  sellPrice: yup
    .number()
    .typeError('Sell price must be a number')
    .required('Sell price is required')
    .min(yup.ref('buyPrice'), 'Sell price must be higher than buy price'),
  quantity: yup.number().required().min(0),
  minStock: yup.number().required().min(0),
  shelf: yup.string().default(''),
  unit: yup.string().required(),
});

export type ProductFormValues = yup.InferType<typeof productSchema>;
