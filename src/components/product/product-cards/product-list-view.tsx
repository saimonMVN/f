import cn from 'classnames';
import Image from '@components/ui/image';
import Link from '@components/ui/link';
import { useModalAction } from '@components/common/modal/modal.context';
import useWindowSize from '@utils/use-window-size';
import { AddToCart } from '@components/product/add-to-cart';
import { useTranslation } from 'next-i18next';
import { productPlaceholder } from '@assets/placeholders';
import {ROUTES} from "@utils/routes";
import {ProductPreviewType} from "@interfaces/global";
import {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import {isSingleVariantInStockOrBackorder} from "@lib/util/is-single-variant-inStock-or-backorder";

interface IProductCardProps {
  previewProduct: ProductPreviewType;
  pricedProduct: PricedProduct;
  className?: string
}

function RenderPopupOrAddToCart({
  previewProduct,
  pricedProduct,
}: IProductCardProps) {
  const { t } = useTranslation('common');
  const { id, variants, ...rest } = pricedProduct ?? {};
  const { openModal } = useModalAction();
  function handlePopupView() {
    openModal('PRODUCT_VIEW', {
      pricedProduct: pricedProduct,
      previewProduct: previewProduct,
    });
  }
  if (isSingleVariantInStockOrBackorder(variants) && variants[0].id) {
    return <AddToCart variantId = {variants[0].id} quantity = {1} />
  }
  else if(variants.length > 1){
    return (
        <button
            className="min-w-[150px] px-4 py-2 bg-skin-primary rounded-full  text-skin-inverted text-[13px] items-center justify-center focus:outline-none focus-visible:outline-none"
            aria-label="Count Button"
            onClick={handlePopupView}
        >
          {t('text-product-details')}
        </button>
    );
  } else {
    return (
        <span className="text-[11px] text-skin-inverted uppercase inline-block bg-skin-red rounded-full px-2.5 pt-1 pb-[3px] mx-0.5 sm:mx-1">
        {t('Out-stock')}
      </span>
    );
  }
}

const ProductList: React.FC<IProductCardProps> = ({ previewProduct, pricedProduct, className }) => {
  const { title,handle, description,thumbnail } = pricedProduct ?? {};
  return (
    <article
      className={cn(
        ' product-list-view card-image--jump  overflow-hidden relative  grid grid-cols-4  gap-8',
        className
      )}
      title={title}
    >
      <div className="col-span-1 ">
        <Link
            href={`${ROUTES.PRODUCTS}/${handle}`}
            className="block border border-skin-base hover:border-skin-primary"
        >
        <div className="max-w-[270px] mx-auto relative ">
          <Image
            src={thumbnail ?? productPlaceholder}
            alt={title || 'Product Image'}
            width={270}
            height={270}
            quality={100}
            className="object-cover bg-skin-thumbnail"
          />
        </div>
        </Link>
      </div>

      <div className="col-span-3">
        <div className="text-12px sm:text-sm mt-auto text-gray-400 mb-2">
        {pricedProduct.collection?.title}
        </div>
        <Link
            href={`${ROUTES.PRODUCTS}/${handle}`}
            className="text-skin-base text-base font-semibold leading-5 min-h-[30px] line-clamp-2 mb-1.5 hover:text-skin-primary"
        >
          {title}
        </Link>



        <div className="space-s-2 mb-2">
          <span className="inline-block font-semibold text-sm sm:text-15px lg:text-base text-skin-primary">
          {previewProduct.price?.calculated_price}
          </span>
          {previewProduct.price?.price_type === 'sale' && (
              <del className="text-sm text-gray-400 text-opacity-70">
                {previewProduct.price.original_price}
              </del>
          )}
        </div>
        <p  className="text-sm text-skin-base line-clamp-3 leading-6 text-opacity-80">
          {description}
        </p>
        <div className="inline-block product-cart-button mt-6">
          <RenderPopupOrAddToCart pricedProduct={pricedProduct} previewProduct={previewProduct} />
        </div>

      </div>
    </article>
  );
};

export default ProductList;
