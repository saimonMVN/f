import cn from 'classnames';
import Image from '@components/ui/image';
import Link from '@components/ui/link';
import usePrice from '@framework/product/use-price';
import { Product } from '@framework/types';
import { useModalAction } from '@components/common/modal/modal.context';
import useWindowSize from '@utils/use-window-size';
import SearchIcon from '@components/icons/search-icon';
import { useCart } from '@contexts/cart/cart.context';
import { AddToCart } from '@components/product/add-to-cart';
import { useTranslation } from 'next-i18next';
import { productPlaceholder } from '@assets/placeholders';
import {ROUTES} from "@utils/routes";
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { ProductPreviewType } from 'src/interfaces/global';
import { isSingleVariantInStockOrBackorder } from 'src/lib/util/is-single-variant-inStock-or-backorder';
import Head from 'next/head';

interface ProductProps {
  previewProduct: ProductPreviewType;
  pricedProduct: PricedProduct;
}
function RenderPopupOrAddToCart({
  previewProduct,
  pricedProduct,
}: ProductProps) {
  const { t } = useTranslation('common');
  const { id, ...rest } = pricedProduct ?? {};
  const { width } = useWindowSize();
  const { openModal } = useModalAction();
  function handlePopupView() {
    openModal('PRODUCT_VIEW', {
      pricedProduct: pricedProduct,
      previewProduct: previewProduct,
    });
  }
  if (isSingleVariantInStockOrBackorder(pricedProduct.variants) && pricedProduct.variants[0].id) {
    return <AddToCart variantId = {pricedProduct.variants[0].id} quantity = {1} />
  } 
  else if(pricedProduct.variants.length > 1){
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

const ProductCard = ({
  previewProduct,
  pricedProduct,
  className
}: {
  previewProduct: ProductPreviewType;
  pricedProduct: PricedProduct;
  className?: string
}) => {
  const { openModal } = useModalAction();
  const { t } = useTranslation('common');
  const { width } = useWindowSize();
  const iconSize = width! > 1024 ? '20' : '17';

  function handlePopupView() {
    openModal('PRODUCT_VIEW', { pricedProduct, previewProduct });
  }


  return (
    <article
    className={cn(
      'flex flex-col product-card relative card-image--jump px-2 sm:px-3 overflow-hidden  h-full',
      className
    )}
    title={pricedProduct.title}
  >
    <div className="relative flex-shrink-0  mt-4">
      <div className="card-img-container flex overflow-hidden max-w-[230px] mx-auto relative">
          <Image
            src={previewProduct.thumbnail ?? productPlaceholder}
            alt={previewProduct.title || 'Product Image'}
            width={230}
            height={200}
            quality={100}
            className="object-cover bg-skin-thumbnail"
          />
        </div>
        <div className="w-full h-full absolute top-0 pt-2.5 md:pt-3.5 z-10 -mx-0.5 sm:-mx-1">
          {previewProduct.price?.price_type === 'sale' && (
           <span className="text-[10px]  text-skin-inverted uppercase inline-block bg-skin-primary rounded-sm px-2.5 pt-1 pb-[3px] mx-0.5 sm:mx-1">
              {t('text-on-sale')}
            </span>
          )}
          <button
             className="buttons--quickview px-4 py-2 bg-skin-inverted rounded-full hover:bg-skin-primary hover:text-skin-inverted"
             aria-label="Quick View Button"
              onClick={handlePopupView}
          >
            <SearchIcon width={iconSize} height={iconSize} opacity="1" />
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-2 h-full overflow-hidden text-center relative">
        <div className="text-sm mt-auto leading-6 text-gray-400 mb-1.5">
                    {/* product collection  */}
                    {pricedProduct.collection?.title}
        </div>
        <Link
            href={`${ROUTES.PRODUCTS}/${previewProduct.handle}`}
            className="text-skin-base text-sm leading-5  line-clamp-2 mb-2 hover:text-skin-primary"
        >
          {previewProduct.title}
        </Link>
        <div className="space-s-2 mb-4 lg:mb-4">
          <span className="inline-block font-semibold text-15px lg:text-base text-skin-primary">
          {previewProduct.price?.calculated_price}
          </span>
          {previewProduct.price?.price_type === 'sale' && (
            <del className="text-sm text-gray-400 text-opacity-70">
              {previewProduct.price.original_price}
            </del>
          )}

        </div>
        <div className="inline-block product-cart-button">
        <RenderPopupOrAddToCart
            pricedProduct={pricedProduct}
            previewProduct={previewProduct}
          />
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
