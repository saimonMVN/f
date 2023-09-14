import cn from 'classnames';
import Image from '@components/ui/image';
import Link from '@components/ui/link';
import { useModalAction } from '@components/common/modal/modal.context';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { productPlaceholder } from '@assets/placeholders';
import {ROUTES} from "@utils/routes";
import { ProductPreviewType } from '@interfaces/global';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
interface IProductCardProps {
  previewProduct: ProductPreviewType;
  pricedProduct: PricedProduct;
  className?: string
}

const ProductList = ({
  previewProduct,
  pricedProduct,
  className
}: IProductCardProps) => {
  return (
    <article
      className={cn(
        'grid grid-cols-7 product-card card-image--jump  overflow-hidden relative gap-2',
        className
      )}
      title={pricedProduct.title}
    >
      <div className="col-span-3">
        <div className="max-w-[120px] mx-auto relative ">
          <Image
            src={previewProduct.thumbnail ?? productPlaceholder}
            alt={previewProduct.title || 'Product Image'}
            width={230}
            height={200}
            quality={100}
            className="object-cover bg-skin-thumbnail"
          />
        </div>
      </div>

      <div className="col-span-4 ">
        <Link
            href={`${ROUTES.PRODUCTS}/${previewProduct.handle}`}
            className="text-skin-base text-sm leading-5 line-clamp-2 mb-1.5 hover:text-skin-primary"
        >
          {previewProduct.title}
        </Link>
        <div className="text-12px sm:text-sm mt-auto text-gray-400 mb-2">
        {pricedProduct.collection?.title}
        </div>
        <div className="space-s-2 ">
          <span className="inline-block font-semibold text-sm sm:text-15px lg:text-base text-skin-primary">
          {previewProduct.price?.calculated_price}
          </span>
          {previewProduct.price?.price_type === 'sale' && (
            <del className="text-sm text-gray-400 text-opacity-70">
              {previewProduct.price.original_price}
            </del>
          )}
        </div>

      </div>
    </article>
  );
};

export default ProductList;
