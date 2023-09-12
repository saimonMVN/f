import { ProductCategory } from '@medusajs/medusa';
import { Category } from '@framework/types';

interface ISubMenu {
  id: number | string;
  path: string;
  label: string;
  subMenu?: ISubMenu[];
}

interface IFormatCategoriesMenuType {
  id: string | number;
  path: string;
  label: string;
  type: string;
  mega_categoryCol: number;
  mega_bannerMode: string;
  mega_bannerImg: string;
  mega_bannerUrl: string;
  mega_contentBottom: string;
  subMenu: ISubMenu[];
}

export default class CategoriesHelper {
  // main method, this will be directly use in necessary pages
  static pushCategoriesIntoMenuData<T1 extends IFormatCategoriesMenuType>(
    menuData: T1[],
    productCategories: ProductCategory[] | undefined
  ): T1[] {
    const filtersParents = this.getCategoriesParents(productCategories || []);

    const formatCategoriesObject: IFormatCategoriesMenuType = {
      id: this.generateUniqueID(),
      path: '/search',
      label: 'menu-categories',
      type: 'relative',
      mega_categoryCol: 5,
      mega_bannerMode: 'none',
      mega_bannerImg: '',
      mega_bannerUrl: '',
      mega_contentBottom: '',
      subMenu: this.modifyMedusaCategoriesAsMenu(filtersParents),
    };

    const index = menuData.findIndex((x) => x.label === 'menu-categories');
    if (index) {
      // Create a new array with the same values as the original
      const newArray = [...menuData];
      // Replace the value at the specified index with the new value
      // @ts-ignore
      newArray[index] = formatCategoriesObject;
      return newArray;
    } else {
      // @ts-ignore
      return menuData.splice(1, 0, formatCategoriesObject);
    }
  }

  static getCategories(categories: ProductCategory[] | undefined | null) {
    if (!categories) return [];
    const filtersParentsCategories = this.getCategoriesParents(categories);
    return this.modifyMedusaCategoriesAsTemplate(filtersParentsCategories);
  }

  private static generateUniqueID(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}${random}`;
  }

  private static getCategoriesParents(
    categories: ProductCategory[]
  ): ProductCategory[] {
    return categories.filter((cat) => !cat.parent_category_id);
  }

  private static modifyMedusaCategoriesAsMenu(
    filtersCategories: ProductCategory[]
  ): ISubMenu[] {
    if (filtersCategories) {
      return filtersCategories.map((category) => {
        const mappedCategory = {
          id: category.id,
          path: `/search?category=${category.id}`,
          label: category.name,
          subMenu: [] as ISubMenu[],
        };

        if (
          category.category_children &&
          category.category_children.length > 0
        ) {
          mappedCategory.subMenu = this.modifyMedusaCategoriesAsMenu(
            category.category_children
          );
        }

        return mappedCategory;
      });
    } else {
      return [];
    }
  }

  private static modifyMedusaCategoriesAsTemplate(
    categories: ProductCategory[]
  ): Category[] {
    return categories.map((category) => {
      const mappedCategory = {
        id: category.id,
        slug: category.id,
        name: category.name,
        children: [] as Category[],
      };
      if (category.category_children && category.category_children.length > 0) {
        mappedCategory.children = this.modifyMedusaCategoriesAsTemplate(
          category.category_children
        );
      }
      return mappedCategory;
    });
  }

  // static getCategoriesSlugsByIds(ids: string, productCategory: ProductCategory[] | undefined): string {
  //     console.log(ids,"ids",productCategory)
  //
  //     if (productCategory) {
  //         const idsArray = ids.split(",")
  //         const idToSlugMap: any = {} as { id: string };
  //         // Create a mapping of IDs to slugs
  //         productCategory.forEach(item => {
  //             idToSlugMap[item.id] = item.handle;
  //         });
  //         const matchingSlugs: string[] = idsArray.map(id => idToSlugMap[id]);
  //         return matchingSlugs.join(",")
  //     } else {
  //
  //         return ids
  //     }
  //
  //
  // }
}
