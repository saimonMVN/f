import Alert from '@components/ui/alert';
import Scrollbar from '@components/ui/scrollbar';
import SidebarMenu from '@components/ui/sidebar-menu';
import CategoryListCardLoader from '@components/ui/loaders/category-list-card-loader';
import { useCategoriesQuery } from '@framework/category/get-all-categories';
import cn from 'classnames';
import CategoryMenu from '@components/ui/category-menu';
import {Category} from "@framework/types";

interface ICategoryDropdownProps {
    className?: string;
    categoriesLimit?: number;
    categories:Category[];
    loading:boolean;
}

const CategoryDropdownMenu: React.FC<ICategoryDropdownProps> = ({
     className,
     categoriesLimit= 12,
     categories,
     loading
      }) => {

    return (
        <div className={cn('absolute z-30 w-72 lg:w-full ', className)}>
            <div className="max-h-full">
                {loading ? (
                    <div className={"w-full bg-skin-fill border-t-0 border-2 border-skin-primary rounded-b-md category-dropdown-menu"}>
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <CategoryListCardLoader
                                key={`category-list-${idx}`}
                                uniqueKey="category-list-card-loader"
                            />
                        ))}
                    </div>
                ) : (
                    <CategoryMenu items={categories} categoriesLimit={categoriesLimit} />
                )}
            </div>
        </div>
    );
};

export default CategoryDropdownMenu;
