import dynamic from 'next/dynamic';
import CategoryCard from '@components/cards/category-card';
import SectionHeader from '@components/common/section-header';
import {ROUTES} from '@utils/routes';
import Alert from '@components/ui/alert';
import {SwiperSlide} from 'swiper/react';
import CategoryListCardLoader from "@components/ui/loaders/category-list-card-loader";
import { useProductCategories } from 'medusa-react';
import CategoriesHelper from '@utils/SDK/CategoriesHelper';
import { AppConst } from '@utils/app-const';

const Carousel = dynamic(() => import('@components/ui/carousel/carousel'), {
    ssr: false,
});

interface CategoriesProps {
    className?: string;
}

const breakpoints = {
    '1480': {
        slidesPerView: 6,
        spaceBetween: 1
    },
    '1280': {
        slidesPerView: 4,
        spaceBetween: 1
    },
    '1024': {
        slidesPerView: 3,
        spaceBetween: 1
    },
    '768': {
        slidesPerView: 3,
        spaceBetween: 1
    },
    '600': {
        slidesPerView: 2,
        spaceBetween: 1
    },
    '0': {
        slidesPerView: 2,
        spaceBetween: 1
    },
};

const CategoryGridBlock: React.FC<CategoriesProps> = ({
                                                          className = 'md:pt-3 lg:pt-0 3xl:pb-2 mb-12 sm:mb-14 md:mb-16 xl:mb-24 2xl:mb-16',
                                                      }) => {
    const {
        product_categories,
        isLoading,
        error
    } = useProductCategories({include_descendants_tree:true})

    const data = CategoriesHelper.getCategories(product_categories)
    return (
        <div className={className}>
            <SectionHeader
                sectionHeading="text-choose-categories"
                className="mb-3"
            />
            <div className="rounded border border-black/5 bg-black/5 w-full overflow-hidden">
                {error ? (
                    <Alert message={error?.message} className="mb-14 3xl:mx-3.5"/>
                ) : (
                    <Carousel
                        grid={{rows: 2, fill: 'row'}}
                        breakpoints={breakpoints}
                        className="shopby-categories bg-white"
                    >
                        {isLoading && !data
                            ? Array.from({length: 12}).map((_, idx) => {
                                return (
                                    <SwiperSlide key={`category--key-${idx}`}>
                                        <CategoryListCardLoader uniqueKey={`category-card-${idx}`}/>
                                    </SwiperSlide>
                                );
                            })
                            : data?.slice(0, AppConst.CATEGORIES_LIMIT)?.map((category) => (
                                <SwiperSlide key={`category--key-${category.id}`}>
                                    <CategoryCard
                                        item={category}
                                        href={{
                                            pathname: ROUTES.SEARCH,
                                            query: {category: category.slug},
                                        }}
                                        className="p-2 sm:p-4 bg-white"
                                    />
                                </SwiperSlide>
                            ))}
                    </Carousel>
                )}
            </div>
        </div>
    );
};

export default CategoryGridBlock;
