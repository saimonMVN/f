import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import CategoryFilterMenu from '@components/search/category-filter-menu';
import Alert from '@components/ui/alert';
import Scrollbar from '@components/ui/scrollbar';
import CategoryListCardLoader from '@components/ui/loaders/category-list-card-loader';
import { useCategoriesQuery } from '@framework/category/get-all-categories';
import {useProductCategories} from "medusa-react";
import CategoriesHelper from "@utils/SDK/CategoriesHelper";

export const CategoryFilter = () => {
  const { t } = useTranslation('common');
    const { product_categories, isLoading, error } = useProductCategories({
        include_descendants_tree: true,
    });

    const categories = CategoriesHelper.getCategories(product_categories);

  if (isLoading) {
    return (
      <div className="hidden xl:block">
        <div className="w-72 mt-8 px-2">
          <CategoryListCardLoader uniqueKey="category-list-card-loader" />
        </div>
      </div>
    );
  }
  if (error) return <Alert message={error.message} />;

  return (
    <div className="block">
      <Heading className="lg:text-xl mb-5 -mt-1 block-title">{t('text-categories')}</Heading>
      <div className=" max-h-full overflow-hidden ">
        <Scrollbar className="w-full category-filter-scrollbar">
          {categories.length ? (
            <CategoryFilterMenu items={categories} />
          ) : (
            <div className="min-h-full pt-6 pb-8 px-9 lg:p-8">
              {t('text-no-results-found')}
            </div>
          )}
        </Scrollbar>
      </div>
    </div>
  );
};
