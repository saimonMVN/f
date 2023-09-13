import Testimonial from '@components/common/testimonial';
import Seo from '@components/seo/seo';
import FeatureCarousel from '@components/common/featured-carousel';
import Layout from '@components/layout/layout-two';
import Container from '@components/ui/container';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import BannerGridTwo from '@components/common/banner-grid-two';
import {
  homeTwoGridHero2 as bannerGridHero2,
  homeTwoGridHero as bannerGridHero,
  homeTwoHeroCarousel as bannerHeroCarousel,
  homeTwoHeroSlider as heroBanner,
  homeTwoSidebar as heroSidebar,
  bannerDiscount,
} from '@framework/static/banner';
import { GetServerSideProps } from 'next';
import HeroSliderBlock from '@components/hero/hero-slider-block';
import BannerGrid from '@components/common/banner-grid';
import ListingTabsElectronicFeed from '@components/product/feeds/listingtabs-electronic-feed';
import ListingTabsClothFeed from '@components/product/feeds/listingtabs-cloth-feed';
import { useRouter } from 'next/router';
import { getDirection } from '@utils/get-direction';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { AppConst } from '@utils/app-const';
import { getCookieByCookiesKey } from '@utils/global';
import medusaRequest from '@lib/medusa-fetch';

interface IProductPropsType {
  products: PricedProduct[];
  count:number;
  limit:number;
  offset:number;
  error?: string | undefined | null;
}
export default function Home({ products, count, limit, offset,  error }: IProductPropsType) {
  const { locale } = useRouter();
  const dir = getDirection(locale);


  return (
    <>
      <Seo
        title="Electronics Store Store React Template"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="home2"
      />
      <Container>
        <div
          className={` grid gap-4 grid-cols-1 xl:gap-6 lg:grid-cols-[minmax(72%,_1fr)_1fr] xl:grid-cols-[minmax(72%,_1fr)_1fr] ${
            dir == 'rtl' ? '2xl:mr-[18.4rem]' : '2xl:ml-[18.4rem]'
          }`}
        >
          <HeroSliderBlock
            heroBanner={heroBanner}
            heroContent={false}
            className={`lg:mb-7 mt-6`}
            contentClassName="p-5 sm:pb-24 xl:pb-32 sm:pt-16 xl:pt-24 md:min-h-[380px]  xl:min-h-[490px] 2xl:min-h-[550px]"
          />
          <BannerGrid
            data={bannerHeroCarousel}
            grid={1}
            className="mb-7 mt-3 lg:mt-6 staticBanner--slider"
            girdClassName={'xl:gap-6'}
          />
        </div>
        <FeatureCarousel />
      </Container>
      <Container>
        <div className="grid grid-cols-12 gap-4 xl:gap-8">
          <div className="maincontent-left col-span-12 lg:col-span-3 2xl:col-span-2">
            {/* <BannerGrid data={heroSidebar} grid={1} className="relative mb-8" /> */}
            {/* <BestSellerSidebarProductFeed /> */}
            {/* <Latestblog className="mb-8" /> */}
            {/* <NewSidebarProductFeed /> */}
            <Testimonial className="mb-8" />
          </div>
          <div className="maincontent-right col-span-12  lg:col-span-9 2xl:col-span-10">
            {/* <ProductWithBestDeals /> */}
            <ListingTabsElectronicFeed colSiderbar={false} category={undefined} products={products} error={error} />
            {/* <BannerGridTwo
              data={bannerGridHero}
              className="mb-8 lg:mb-12"
              girdClassName="xl:gap-6 "
            /> */}
            <ListingTabsClothFeed colSiderbar={false} category={undefined} products={products} error={error} />
            {/* <BannerGridTwo
              data={bannerGridHero2}
              className="mb-8 lg:mb-12"
              girdClassName="xl:gap-6 xl:grid-cols-[minmax(654px,_1fr)_1fr] 2xl:grid-cols-[minmax(954px,_1fr)_1fr] "
            /> */}
            {/* <CategoryGridListBlock className="mb-6 lg:mb-8" /> */}
            {/* <BannerAllCarousel
              data={bannerDiscount}
              className="mb-8 lg:mb-12"
            /> */}
          </div>
        </div>
      </Container>
    </>
  );
}

Home.Layout = Layout;

export const getServerSideProps: GetServerSideProps<
    IProductPropsType
> = async ({locale, req}) => {
    try {
        const cookies = req.headers.cookie || ""
        const cart_id = getCookieByCookiesKey(AppConst.CART_COOKIES_ID, cookies);
        const res = await medusaRequest('GET', '/products', {
            query: {
                cart_id,
                limit:AppConst.PRODUCT_LIMIT
            },
        });

        if (
            !res.ok
        ) {
            return {notFound: true};
        }

        const {products, count, limit, offset } = res.body
        return {
            props: {
                products: products,
                count,
                limit,
                offset,
                error: null,
                ...(await serverSideTranslations(locale!, [
                    'common',
                    'forms',
                    'menu',
                    'footer',
                ])),
            },
        };
    } catch (err) {
        return {
            notFound: true,
        };
    }
};
