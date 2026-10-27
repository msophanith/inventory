import * as yup from 'yup';

type Translator = (keyPath: string, params?: Record<string, string | number>) => string;

export const createProductSchema = (t?: Translator) =>
  yup.object({
    id: yup.string().default(''),
    name: yup
      .string()
      .required(t ? t('products.productNameRequired') : 'Product name is required'),
    description: yup.string().default(''),
    barcode: yup
      .string()
      .required(t ? t('products.barcodeRequired') : 'Barcode is required'),
    category: yup
      .string()
      .required(t ? t('products.categoryRequired') : 'Category is required'),
    buyPrice: yup
      .number()
      .typeError(t ? t('products.buyPriceNumber') : 'Buy price must be a number')
      .required(t ? t('products.buyPriceRequired') : 'Buy price is required')
      .min(0),
    sellPrice: yup
      .number()
      .typeError(t ? t('products.sellPriceNumber') : 'Sell price must be a number')
      .required(t ? t('products.sellPriceRequired') : 'Sell price is required')
      .min(
        yup.ref('buyPrice'),
        t
          ? t('products.sellPriceHigher')
          : 'Sell price must be higher than buy price',
      ),
    quantity: yup.number().required().min(0),
    minStock: yup.number().required().min(0),
    shelf: yup.string().default(''),
    unit: yup.string().required(),
  });

export const productSchema = createProductSchema();

export type ProductFormValues = yup.InferType<typeof productSchema>;
