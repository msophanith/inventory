import FormInput from './form-input';

interface Props {
  register: any;
  errors: any;
  watch: any;
}

const ProductImage = ({ register, errors, watch }: Props) => {
  const image = watch('imageUrl');

  return (
    <div className='rounded-2xl border bg-white p-6'>
      <h2 className='mb-5 font-semibold'>Image</h2>

      <FormInput
        label='Image URL'
        name='imageUrl'
        register={register}
        error={errors.imageUrl?.message}
      />

      {image && (
        <img
          src={image}
          className='mt-4 h-32 w-32 rounded-xl object-cover'
          alt='product'
        />
      )}
    </div>
  );
};

export default ProductImage;
