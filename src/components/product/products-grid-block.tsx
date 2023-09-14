import SectionHeader from '@components/common/section-header';
import ProductCard from '@components/product/product-cards/product-card';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import Alert from '@components/ui/alert';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { useCart } from 'medusa-react';
import usePreviews from '@lib/hooks/use-previews';
import { ProductProvider } from '@lib/context/product-context';

interface ProductsProps {
  sectionHeading: string;
  sectionSubHeading?: string;
  headingPosition?: 'left' | 'center';
  className?: string;
  products?: PricedProduct[];
  loading: boolean;
  error?: string;
  limit?: number;
  uniqueKey?: string;
}

const ProductsGridBlock: React.FC<ProductsProps> = ({
  sectionHeading,
  sectionSubHeading,
  headingPosition = 'center',
  className = 'mb-12 lg:mb-14 xl:mb-16',
  products,
  loading,
  error,
  limit,
  uniqueKey,
}) => {

  const { cart } = useCart()

  const previews = usePreviews({ products, region: cart?.region })

  return (
    <div className={`${className}`}>
      <SectionHeader
        sectionHeading={sectionHeading}
        sectionSubHeading={sectionSubHeading}
        headingPosition={headingPosition}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 md:gap-4 2xl:gap-5">
        {error ? (
          <Alert message={error} className="col-span-full" />
        ) : loading && !products?.length ? (
          Array.from({ length: limit! }).map((_, idx) => (
            <ProductCardLoader
              key={`${uniqueKey}-${idx}`}
              uniqueKey={`${uniqueKey}-${idx}`}
            />
          ))
        ) : (
          products && previews?.slice(0, limit).map((product, idx) => (
            <ProductProvider key={`${uniqueKey}-${product.id}`} product={products[idx]}>
              <ProductCard pricedProduct={products[idx]} previewProduct={product} />
            </ProductProvider>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsGridBlock;
