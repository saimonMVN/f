import Seo from '@components/seo/seo';
import FeatureCarousel from "@components/common/featured-carousel-four";
import Layout from '@components/layout/layout-five';
import Container from '@components/ui/container';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {
    homeFourHeroCarousel as bannerHeroCarousel,
    homeFiveHeroSlider as heroSlider,
    homeFourGridHero as bannerGrid,
    bannerDiscount as brandCarousel,
    homeFourGridHero2 as bannerGrid2,
} from '@framework/static/banner';
import {GetServerSideProps} from 'next';
import LatestblogCarousel from "@components/common/latestblog-four";
import HeroSliderBlock from "@components/hero/hero-slider-block";
import BannerGrid from "@components/common/banner-grid";
import BannerAllCarousel from "@components/common/banner-all-carousel";
import SuppercategoryPopular from "@components/product/feeds/suppercategory-popular";
import ListingTabsElectronicFeed from "@components/product/feeds/listingtabs-electronic-v2";
import ListingTabsClothFeed from "@components/product/feeds/listingtabs-cloth-v2";
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { getCookieByCookiesKey } from '@utils/global';
import { AppConst } from '@utils/app-const';
import { fetchProductsList } from '@lib/data';
interface IHomeProductResponse {
    products: PricedProduct[];
    count: number;
    nextPage?:null | number;
    prePage?:null | number
  }
  
  interface IHomeProps {
    response: IHomeProductResponse;
  }

export default function Home({response}: IHomeProps) {
    return (
        <>
            <Seo
                title="Electronics Store Store React Template"
                description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
                path="home5"
            />

            <Container className={"sm:max-w-[1730px]"}>
                <HeroSliderBlock
                    heroBanner={heroSlider}
                    heroContent={false}
                    className={`lg:mb-7 mt-6 2xl:ms-80`}
                    contentClassName="p-7 sm:pb-24 xl:pb-32 sm:pt-16 xl:pt-24 md:min-h-[320px] xl:min-h-[390px] 2xl:min-h-[438px]"
                />
                <FeatureCarousel className={"home4-featuredCarousel"} classNameCarousel={"bg-white"}/>
                <BannerGrid
                    data={bannerGrid}
                    grid={3}
                    className="mb-8 lg:mb-12"
                />

                {/* <SuppercategoryPopular className="mb-8 lg:mb-12" rowCarousel={2} showBanner={true}/> */}
                <BannerGrid
                    data={bannerGrid2}
                    grid={3}
                    className="mb-8 lg:mb-12"
                />

                <ListingTabsElectronicFeed products={response.products} showBanner={"right"} colSiderbar={false} category={undefined} />
                <ListingTabsClothFeed products={response.products}  showBanner={"left"} colSiderbar={false} category={undefined} />

                <LatestblogCarousel className="mb-8 lg:mb-12"/>
                <BannerAllCarousel
                    data={brandCarousel}
                    className="mb-8 lg:mb-12"
                    layout={"home4"}
                />
            </Container>
        </>
    );
}

Home.Layout = Layout;

export const getServerSideProps: GetServerSideProps<IHomeProps> = async ({ locale, req }) => {
    try {
      const cookies = req.headers.cookie || ""
      const cart_id = getCookieByCookiesKey(AppConst.CART_COOKIES_ID, cookies) as string;

        const res = await fetchProductsList({
          queryParams: {
            cart_id,
          },
        });
    
        const productsData = res.response;
        return {
          props: {
            response: {...productsData, nextPage:res.nextPage, prePage:res.prePage},
            ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
          },
        };
      } catch (error) {
        return {
          props: {
            response: {
              products: [],
              count: 0,
              nextPage:null,
              prePage:null
            },
            ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
          },
        };
      }
    };
    