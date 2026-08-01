const ProductDetailsSkeleton = () => {
  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6'>
      <div className='space-y-6 animate-pulse'>
        {/* Back button */}
        <div
          className='
            h-5
            w-32
            rounded
            bg-gray-200
          '
        />

        {/* Hero Skeleton */}
        <div
          className='
            rounded-3xl
            border
            bg-white
            p-6
          '
        >
          <div
            className='
              flex
              flex-col
              gap-6
              md:flex-row
            '
          >
            {/* Image */}
            <div
              className='
                h-28
                w-28
                rounded-2xl
                bg-gray-200
              '
            />

            <div className='flex-1 space-y-3'>
              <div
                className='
                  h-7
                  w-64
                  rounded
                  bg-gray-200
                '
              />

              <div
                className='
                  h-4
                  w-full
                  max-w-xl
                  rounded
                  bg-gray-200
                '
              />

              <div className='flex gap-3'>
                <div
                  className='
                    h-7
                    w-32
                    rounded-full
                    bg-gray-200
                  '
                />

                <div
                  className='
                    h-7
                    w-24
                    rounded-full
                    bg-gray-200
                  '
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}

        <div
          className='
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          '
        >
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className='
                  h-32
                  rounded-2xl
                  border
                  bg-white
                '
            />
          ))}
        </div>

        {/* Stock Skeleton */}

        <div
          className='
            h-44
            rounded-3xl
            border
            bg-white
          '
        />

        {/* Info Skeleton */}

        <div
          className='
            rounded-3xl
            border
            bg-white
            p-6
          '
        >
          <div
            className='
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            '
          >
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className='
                    h-16
                    rounded-xl
                    bg-gray-200
                  '
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
