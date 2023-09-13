import SectionHeader from '@components/common/section-header';
import ProductCard from '@components/product/product-cards/product-card-v2';
import { Product } from '@framework/types';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from '@components/ui/carousel/slider';
import Alert from '@components/ui/alert';
import SeeAll from '@components/ui/see-all';
import useWindowSize from '@utils/use-window-size';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { getDirection } from '@utils/get-direction';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { AppConst } from '@utils/app-const';
import { useCart } from 'medusa-react';
import usePreviews from '@lib/hooks/use-previews';
import { ProductProvider } from '@lib/context/product-context';

interface ProductsCarouselProps {
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  products?: PricedProduct[];
  loading: boolean;
  error?: string;
  limit?: number;
  uniqueKey?: string;
  borderCarousel?: boolean;
  carouselBreakpoint?: {} | any;
  rowCarousel?: number;
}

const breakpoints = {
  '1536': {
    slidesPerView: 6,
  },
  '1280': {
    slidesPerView: 5,
  },
  '1024': {
    slidesPerView: 4,
  },
  '640': {
    slidesPerView: 3,
  },
  '360': {
    slidesPerView: 2,
  },
  '0': {
    slidesPerView: 1,
  },
};

const ProductsCarousel: React.FC<ProductsCarouselProps> = ({
  sectionHeading,
  categorySlug,
  className = '',
  products,
  loading,
  error,
  limit = AppConst.PRODUCT_LIMIT,
  uniqueKey,
  borderCarousel,
   carouselBreakpoint,
   rowCarousel= 1,
}) => {
  const { width } = useWindowSize();
  const { locale } = useRouter();
  const dir = getDirection(locale);
  if(width!  < 767 ) limit = 4;

  const { cart } = useCart()

  const previews = usePreviews({ products, region: cart?.region })

  return (
    <div
      className={cn(
        'relative',
        className
      )}
    >
      {
        sectionHeading && (
              <SectionHeader sectionHeading={sectionHeading} className="mb-3" />
          )
      }

      {error ? (
        <div className="2xl:pe-10">
          <Alert message={error} />
        </div>
      ) : (
        <div className={`heightFull relative ${borderCarousel != undefined ? 'p-3 border border-black/10 rounded bg-white' : ''} `}>
          <Carousel
              grid={{rows: rowCarousel, fill: 'row'}}
              breakpoints={carouselBreakpoint ? carouselBreakpoint : breakpoints}
            prevButtonClassName="start-3  -top-12 3xl:top-auto 3xl:-translate-y-2 4xl:-translate-y-10"
            nextButtonClassName={`end-3 -top-12 3xl:top-auto transform 2xl:translate-x-0 3xl:-translate-y-2 ${
              dir === 'rtl' ? 'xl:-translate-x-2.5' : 'xl:translate-x-2.5'
            }`}
          >
            {loading && !products?.length ? (
              Array.from({ length: limit! }).map((_, idx) => (
                <SwiperSlide
                  key={`${uniqueKey}-${idx}`}
                  className="px-1.5 md:px-2 xl:px-2.5"
                >
                  <ProductCardLoader uniqueKey={`${uniqueKey}-${idx}`} />
                </SwiperSlide>
              ))
            ) : (
              <>
                {products && previews?.slice(0, limit).map((product, idx) => (
                <SwiperSlide
                    key={`${uniqueKey}-${idx}`}
                    className="px-1.5 md:px-2 xl:px-2.5"
                  >
                     <ProductProvider product={products[idx]}><ProductCard pricedProduct={products[idx]} previewProduct={product} /></ProductProvider>
                  </SwiperSlide>
                ))}

              </>
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ProductsCarousel;
