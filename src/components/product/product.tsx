import {useMemo, useState} from 'react';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import {useRouter} from 'next/router';
import {ROUTES} from '@utils/routes';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import {useTranslation} from 'next-i18next';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import {IoArrowRedoOutline} from 'react-icons/io5';
import SocialShareBox from '@components/ui/social-share-box';
import ProductDetailsTab from '@components/product/product-details/product-tab';
import VariationPrice from './variation-price';
import {useProductActions} from '@lib/context/product-context';
import useProductPrice from '@lib/hooks/use-product-price';
import OptionSelect from '@components/common/option-select';
import {PricedProduct} from '@medusajs/medusa/dist/types/pricing';

interface ProductSingleDetailsProps {
    product: PricedProduct;
}

const ProductSingleDetails: React.FC<ProductSingleDetailsProps> = ({ product }) => {
    const router = useRouter();
    useState<boolean>(false);
    const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);
    const [selectedVarientImage, setSelectedVariantImage] = useState<string>('');
    const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.PRODUCT}/${router.query.slug}`;
    const {
        updateOptions,
        disabled,
        options,
        inStock,
        addToCart,
        quantity,
        variant,
        increaseQuantity,
        decreaseQuantity
    } =
        useProductActions();
    const price = useProductPrice({id: product.id!, variantId: variant?.id});
    const selectedPrice = useMemo(() => {
        const {variantPrice, cheapestPrice} = price;

        if (variantPrice?.calculated_price.includes('NaN')) {
            return cheapestPrice;
        } else {
            return variantPrice || cheapestPrice || null;
        }
    }, [price]);

    const {t} = useTranslation('common');
    const handleSetSelectedVarientImage = (image: string) => {
        setSelectedVariantImage(image);
    };
    const handleChange = () => {
        setShareButtonStatus(!shareButtonStatus);
    };

    return (
        <div className="pt-6 md:pt-7 pb-2">
            <div className="lg:grid grid-cols-10 gap-7 2xl:gap-8">
                <div className="col-span-5 xl:col-span-5 overflow-hidden mb-6 md:mb-8 lg:mb-0">
                    {product?.images?.length ? (
                        <ThumbnailCarousel
                            gallery={product.images || []}
                            thumbnailClassName="xl:w-[700px] 2xl:w-[850px]"
                            galleryClassName="xl:w-[100px] 2xl:w-[120px]"
                            showBtnLightBox={true}
                            selectedImageFromVarient={selectedVarientImage}
                        />
                    ) : (
                        <div className="w-auto flex">
                            <Image
                                src={product?.thumbnail ?? '/product-placeholder.svg'}
                                alt={'Product-details-moveshop'}
                                width={900}
                                height={680}
                            />
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex flex-col col-span-5 xl:col-span-5 xl:ps-2">
                    <div className="pb-4 lg:pb-8">
                        <div className="md:mb-2.5 block -mt-1.5">
                            <h2 className="text-skin-base text-lg md:text-xl xl:text-2xl font-medium transition-colors duration-300">
                                {product.title}
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

                    <dl className="productView-info  text-14px leading-8 pb-5 mb-5 border-b border-black/8">

                        {variant?.material && <>
                            <dt
                                className={`productView-info-name w-40 float-left`}
                            >
                                Material
                            </dt>
                            <dd className="productView-info-value"> {variant?.material}</dd>
                        </>
                        }
                        {variant?.weight && <>
                            <dt
                                className={`productView-info-name w-40 float-left`}
                            >
                                Weight
                            </dt>
                            <dd className="productView-info-value">{variant?.weight}</dd>
                        </>


                        }
                        {variant?.weight && <>
                            <dt
                                className={`productView-info-name w-40 float-left`}
                            >
                                Width
                            </dt>
                            <dd className="productView-info-value">
                                {variant?.weight}
                            </dd>
                        </>


                        }
                        {variant?.height && <>
                            <dt
                                className={`productView-info-name w-40 float-left`}
                            >
                                Height
                            </dt>
                            <dd className="productView-info-value">
                                {variant?.height}
                            </dd>

                        </>
                        }

                    </dl>

                    {product.variants.length > 1 && (
                        <div className="my-8 flex flex-col gap-y-6">
                            {(product.options || []).map((option) => {
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
                {!inStock || (!variant && Object.values(options).every(x => x))
                    ? t('text-out-stock')
                    : variant && `${
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

                            }}
                            onDecrement={() => {
                                decreaseQuantity()
                            }}
                            disabled={disabled}
                        />
                        <Button
                            onClick={addToCart}
                            className="w-full px-1.5"
                            disabled={disabled}
                            // loading={addToCartLoader}
                        >
                            <CartIcon color="#ffffff" className="me-3"/>
                            {t('text-add-to-cart')}
                        </Button>
                        <div className="grid grid-cols-2 gap-2.5">
                            {/*<Button*/}
                            {/*  variant="border"*/}
                            {/*  loading={addToWishlistLoader}*/}
                            {/*  className={`group hover:text-skin-primary ${*/}
                            {/*    favorite === true && 'text-skin-primary'*/}
                            {/*  }`}*/}
                            {/*>*/}
                            {/*  {favorite === true ? (*/}
                            {/*    <IoIosHeart className="text-2xl md:text-[26px] me-2 transition-all" />*/}
                            {/*  ) : (*/}
                            {/*    <IoIosHeartEmpty className="text-2xl md:text-[26px] me-2 transition-all group-hover:text-skin-primary" />*/}
                            {/*  )}*/}

                            {/*  {t('text-wishlist')}*/}
                            {/*</Button>*/}
                            <div className="relative group">
                                <Button
                                    variant="border"
                                    className={`w-full hover:text-skin-primary ${
                                        shareButtonStatus === true && 'text-skin-primary'
                                    }`}
                                    onClick={handleChange}
                                >
                                    <IoArrowRedoOutline
                                        className="text-2xl md:text-[26px] me-2 transition-all group-hover:text-skin-primary"/>
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
                    {product?.tags && product?.tags.length > 0 &&(
                        <ul className="pt-5 xl:pt-6">
                            <li className="text-sm md:text-15px text-skin-base text-opacity-80 inline-flex items-center justify-center me-2 relative top-1">
                                <LabelIcon className="me-2"/> {t('text-tags')}:
                            </li>
                            {product.tags.map((item) => {
                                const tag = {
                                    name: item.value,
                                    slug: item.value,
                                    id: item.id,
                                };
                                return (
                                    <li className="inline-block p-[3px]" key={`tag-${item.id}`}>
                                        <TagLabel data={tag}/>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
            <ProductDetailsTab/>
        </div>
    );
};

export default ProductSingleDetails;
