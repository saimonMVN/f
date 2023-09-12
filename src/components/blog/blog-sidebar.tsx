import { CategoryFilter } from './category-filter';
import { BrandFilter } from './brand-filter';
import { FilteredItem } from './filtered-item';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import { DietaryFilter } from '@components/search/dietary-filter';
import Heading from '@components/ui/heading';
import CategoryDropdownSidebar from "@components/category/category-dropdown-sidebar";
import BestSellerSidebarProductFeed from "@components/product/feeds/best-seller-sidebar-product-feed";
import {homeTwoSidebar as heroSidebar} from "@framework/static/banner";
import BannerGrid from "@components/common/banner-grid";

export const BlogSidebar: React.FC = () => {
  const router = useRouter();
  const { pathname, query } = router;
  const { t } = useTranslation('common');
  return (
    <div className="space-y-10">
      <CategoryDropdownSidebar/>
      <BestSellerSidebarProductFeed />
    </div>
  );
};
