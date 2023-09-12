import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useTranslation } from 'next-i18next';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import SocialShareBox from '@components/ui/social-share-box';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import { productGalleryPlaceholder } from '@assets/placeholders';
import { ProductProvider, useProductActions } from '@lib/context/product-context';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { ProductPreviewType } from '@interfaces/global';
import useProductPrice from '@lib/hooks/use-product-price';
import VariationPrice from './variation-price';
import OptionSelect from '@components/common/option-select';

interface IProductDetailsProps {
  pricedProduct: PricedProduct
  previewProduct: ProductPreviewType
}

function ProductPopupChild({pricedProduct, previewProduct}: IProductDetailsProps) {
  const { t } = useTranslation('common');
  const { closeModal } = useModalAction();
  const router = useRouter();
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);
  const [selectedVarientImage, setSelectedVariantImage] = useState<string>('');
    const { id, handle, thumbnail, title, description, images, variants, tags } = pricedProduct;
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.PRODUCT}/${handle}`;

    const { updateOptions,disabled, options, inStock,quantity, variant ,  decreaseQuantity,
      increaseQuantity, addToCart} =
      useProductActions();

      const price= useProductPrice({ id: id!, variantId: variant?.id });
  
    const selectedPrice = useMemo(() => {
      const { variantPrice, cheapestPrice } = price;
         if(variantPrice?.calculated_price.includes("NaN")){
           return cheapestPrice
         }else{
           return variantPrice || cheapestPrice ||  null
         }
    }, [price]);
    
    const handleSetSelectedVarientImage = (image: string) => {
      setSelectedVariantImage(image);
    };
    const handleChange = () => {
      setShareButtonStatus(!shareButtonStatus);
    };
  
  
  

  function navigateToProductPage() {
    closeModal();
    router.push(`${ROUTES.PRODUCT}/${handle}`);
  }

  return (
    <div className="md:w-[600px] lg:w-[940px] xl:w-[1180px]  mx-auto p-1 lg:p-0 xl:p-3 bg-skin-fill rounded-md">
    <CloseButton onClick={closeModal} />
    <div className="overflow-hidden">
      <div className="px-2 md:px-5 mb-2 lg:mb-2 pt-4 md:pt-7 ">
        <div className="lg:flex items-start justify-between gap-8">
          <div className="xl:flex items-center justify-center overflow-hidden">
            {!!images?.length ? (
              <ThumbnailCarousel gallery={images} />
            ) : (
              <div className="w-auto flex items-center justify-center">
                <Image
                  src={thumbnail ?? productGalleryPlaceholder}
                  alt={title!}
                  width={650}
                  height={590}
                />
              </div>
            )}
          </div>

            <div className="flex-shrink-0 flex flex-col lg:w-[430px] xl:w-[520px] 2xl:w-[520px]">
              <div className="pt-5 lg:pt-0 pb-5">
                <div
                  className="mb-2 md:mb-2.5 block -mt-1.5"
                  onClick={navigateToProductPage}
                  role="button"
                >
                  <h2 className="text-skin-base text-lg md:text-xl xl:text-2xl font-medium transition-colors duration-300 hover:text-skin-primary">
                    {title}
                  </h2>
                </div>

             {selectedPrice && (
              <VariationPrice
                calculatedPrice={selectedPrice.calculated_price}
                originalPrice={selectedPrice.original_price}
                percentageDiff={selectedPrice.percentage_diff}
                priceType={selectedPrice.price_type}
              />
            )}

          </div>

          {pricedProduct.variants.length > 1 && (
            <div className="my-8 flex flex-col gap-y-6">
              {(pricedProduct.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      handleSetSelectedVarientImage={
                        handleSetSelectedVarientImage
                      }
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                    />
                  </div>
                );
              })}
            </div>
          )}
                 
            <div className="pb-2">
            {/* check that item isInCart and place the available quantity or the item quantity */}
            {variant?.allow_backorder ? (
              <> </>
            ) : (
              <span className="text-sm font-medium text-skin-yellow-two">
                {!inStock || (!variant && Object.values(options).every(x=>x))
                  ? t('text-out-stock')
                  : variant &&`${
                      t('text-only') +
                      ' ' +
                      variant.inventory_quantity +
                      ' ' +
                      t('text-left-item')
                    }`}
              </span>
            )}
          </div>

           <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
            <Counter
              variant="single"
              value={quantity}
              onIncrement={() => {
                increaseQuantity()
              }
            }
              onDecrement={() => {
                decreaseQuantity()
              }
              }
              disabled={disabled}
            />
            <Button
              onClick={addToCart}
              className="w-full px-1.5"
              disabled={disabled}
              // loading={addToCartLoader}
            >
              <CartIcon color="#ffffff" className="me-3" />
              {t('text-add-to-cart')}
            </Button>
            <div className="grid grid-cols-2 gap-2.5">
              {/* <Button
                variant="border"
                loading={addToWishlistLoader}
                className={`group hover:text-skin-primary ${
                  favorite === true && 'text-skin-primary'
                }`}
              >
                {favorite === true ? (
                  <IoIosHeart className="text-2xl md:text-[26px] me-2 transition-all" />
                ) : (
                  <IoIosHeartEmpty className="text-2xl md:text-[26px] me-2 transition-all group-hover:text-skin-primary" />
                )}

                {t('text-wishlist')}
              </Button> */}
              <div className="relative group">
                <Button
                  variant="border"
                  className={`w-full hover:text-skin-primary ${
                    shareButtonStatus === true && 'text-skin-primary'
                  }`}
                  onClick={handleChange}
                >
                  <IoArrowRedoOutline className="text-2xl md:text-[26px] me-2 transition-all group-hover:text-skin-primary" />
                  {t('text-share')}
                </Button>
                <SocialShareBox
                  className={`absolute z-10 end-0 w-[300px] md:min-w-[400px] transition-all duration-300 ${
                    shareButtonStatus === true
                      ? 'visible opacity-100 top-full'
                      : 'opacity-0 invisible top-[130%]'
                  }`}
                  shareUrl={productUrl}
                />
              </div>
            </div>
          </div>

            <ul className="pt-5 xl:pt-6">
              <li className="text-sm md:text-15px text-skin-base text-opacity-80 inline-flex items-center justify-center me-2 relative top-1">
                <LabelIcon className="me-2" /> {t('text-tags')}:
              </li>
              {tags &&
              tags.map((item) => {
                const tag = {
                  name: item.value,
                  slug: item.value,
                  id: item.id,
                };
                return (
                  <li className="inline-block p-[3px]" key={`tag-${item.id}`}>
                    <TagLabel data={tag} />
                  </li>
                );
                })}
            </ul>

              <div className="pt-6 xl:pt-8 pb-6">
                <Heading className="mb-3 lg:mb-3.5">
                  {t('text-product-details')}:
                </Heading>
                {description &&
                <Text variant="small">
                  {description.split(' ').slice(0, 40).join(' ')}
                  {'...'}
                  <span
                    onClick={navigateToProductPage}
                    role="button"
                    className="text-skin-primary ms-0.5"
                  >
                    {t('text-read-more')}
                  </span>
                </Text>
                }
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}



export default function ProductPopup() {
  const { data } = useModalState();
  const modalData: IProductDetailsProps = data

  return (
  <ProductProvider product={modalData.pricedProduct}>
    <ProductPopupChild pricedProduct={modalData.pricedProduct} previewProduct={modalData.previewProduct} />
  </ProductProvider>)
}