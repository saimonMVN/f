import SectionHeader from '@components/common/section-header';
import CategoryListCardLoader from '@components/ui/loaders/category-list-card-loader';
import Alert from '@components/ui/alert';
import CategoryListCard from '@components/cards/category-list-card';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from 'swiper/react';
import cn from 'classnames';
import { ROUTES } from '@utils/routes';
import { useProductCategories } from 'medusa-react';
import CategoriesHelper from '@utils/SDK/CategoriesHelper';
import { AppConst } from '@utils/app-const';

interface CategoriesProps {
  className?: string;
}

const breakpoints = {
  '1480': {
    slidesPerView: 6,
  },
  '1280': {
    slidesPerView: 5,
  },
  '1024': {
    slidesPerView: 3,
  },
  '768': {
    slidesPerView: 3,
  },
  '600': {
    slidesPerView: 3,
  },
  '0': {
    slidesPerView: 2,
  },
};

const CategoryGridListBlock: React.FC<CategoriesProps> = ({
  className = 'mb-8',
}) => {
  const {
    product_categories,
    isLoading,
    error,
} = useProductCategories({include_descendants_tree:true})

const data = CategoriesHelper.getCategories(product_categories)
  return (
    <div className={cn(className)}>
        <SectionHeader sectionHeading="text-choose-categories" className="mb-6 block-title" />

        <div className="mt-0">
          {error ? (
            <Alert message={error?.message} />
          ) : (
            <>
              <Carousel
                breakpoints={breakpoints}
                grid={{ rows: 1, fill: 'row' }}
                className=""
              >
                {isLoading && !data
                  ? Array.from({ length: 6 }).map((_, idx) => {
                      return (
                        <SwiperSlide
                          className="p-1.5 md:p-2"
                          key={`category--key-${idx}`}
                        >
                          <CategoryListCardLoader
                            uniqueKey={`category-card-${idx}`}
                          />
                        </SwiperSlide>
                      );
                    })
                  : data?.slice(0, AppConst.CATEGORIES_LIMIT).map((category) => (
                      <SwiperSlide
                        key={`category--key-${category.id}`}
                        className=""
                      >
                        <CategoryListCard
                          category={category}
                          href={{
                            pathname: ROUTES.SEARCH,
                            query: { category: category.slug },
                          }}
                          className=""
                        />
                      </SwiperSlide>
                    ))}
              </Carousel>
            </>
          ) }
        </div>

    </div>
  );
};

export default CategoryGridListBlock;
