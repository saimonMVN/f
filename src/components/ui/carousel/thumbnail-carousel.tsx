import {Navigation, Swiper, SwiperOptions, SwiperSlide, Thumbs,} from '@components/ui/carousel/slider';
import Image from '@components/ui/image';
import {useEffect, useRef, useState} from 'react';
import cn from 'classnames';
import {productGalleryPlaceholder} from '@assets/placeholders';
import {getDirection} from '@utils/get-direction';
import {useRouter} from 'next/router';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import ImageLightBox from '@components/ui/image-lightbox';
import {Image as IImage} from '@medusajs/medusa';

interface Props {
    gallery: IImage[];
    thumbnailClassName?: string;
    galleryClassName?: string;
    showBtnLightBox?: boolean;
    selectedImageFromVarient?: string;
}

const swiperParams: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 0,
};

const ThumbnailCarousel: React.FC<Props> = ({
                                                gallery,
                                                thumbnailClassName = 'xl:w-[480px] 2xl:w-[650px]',
                                                galleryClassName = 'xl:w-[100px] 2xl:w-[120px]',
                                                showBtnLightBox = false,
                                                selectedImageFromVarient,
                                            }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const prevRef = useRef<HTMLDivElement>(null);
    const nextRef = useRef<HTMLDivElement>(null);
    const {locale} = useRouter();
    const dir = getDirection(locale);

    useEffect(() => {
        if (selectedImageFromVarient) {
            setThumbsSwiper(selectedImageFromVarient);
        }
    }, [selectedImageFromVarient]);

    return (
        <div className="w-full xl:flex xl:flex-row-reverse relative">
            {showBtnLightBox && <ImageLightBox gallery={gallery}/>}
            <div
                className={cn(
                    'w-full flex  xl:ms-5 overflow-hidden rounded-md relative',
                    thumbnailClassName
                )}
            >
                <Swiper
                    id="productGallery"
                    thumbs={{
                        swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                    }}
                    modules={[Navigation, Thumbs]}
                    navigation={{
                        prevEl: prevRef.current!, // Assert non-null
                        nextEl: nextRef.current!, // Assert non-null
                    }}
                    {...swiperParams}
                >
                    {gallery?.map((item) => (
                        <SwiperSlide key={`product-gallery-${item.id}`} className="flex">
                            <Image
                                src={item.url ?? productGalleryPlaceholder}
                                alt={`Product gallery ${item.id}`}
                                width={650}
                                height={590}
                                className="rounded-lg"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="flex items-center justify-between w-full absolute top-2/4 z-10 px-2.5">
                    <div
                        ref={prevRef}
                        className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-base lg:text-lg xl:text-xl flex items-center cursor-pointer justify-center rounded-full bg-skin-fill transition duration-300 hover:bg-skin-primary hover:text-skin-inverted focus:outline-none transform -translate-y-1/2 shadow-navigation"
                    >
                        {dir === 'rtl' ? <IoIosArrowForward/> : <IoIosArrowBack/>}
                    </div>
                    <div
                        ref={nextRef}
                        className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 text-base lg:text-lg xl:text-xl flex items-center justify-center cursor-pointer rounded-full bg-skin-fill  transition duration-300 hover:bg-skin-primary hover:text-skin-inverted focus:outline-none transform -translate-y-1/2 shadow-navigation"
                    >
                        {dir === 'rtl' ? <IoIosArrowBack/> : <IoIosArrowForward/>}
                    </div>
                </div>
            </div>

            {/* End of product main slider */}
            <div className={`flex-shrink-0 ${galleryClassName}`}>
                <Swiper
                    id="productGalleryThumbs"
                    onSwiper={setThumbsSwiper}
                    spaceBetween={15}
                    watchSlidesProgress={true}
                    freeMode={true}
                    effect={'slide'}
                    breakpoints={{
                        1280: {
                            slidesPerView: 4,
                            direction: 'vertical',
                        },
                        767: {
                            slidesPerView: 4,
                            direction: 'horizontal',
                        },
                        0: {
                            slidesPerView: 3,
                            direction: 'horizontal',
                        },
                    }}
                >
                    {gallery?.map((item) => (
                        <SwiperSlide
                            key={`product-thumb-gallery-${item.id}`}
                            className="flex cursor-pointer rounded overflow-hidden border border-skin-base transition hover:opacity-75"
                        >
                            <Image
                                src={item?.url ?? productGalleryPlaceholder}
                                alt={`Product thumb gallery ${item.id}`}
                                width={170}
                                height={170}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ThumbnailCarousel;
