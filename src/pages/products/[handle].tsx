import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import ProductSingleDetails from '@components/product/product';
import Breadcrumb from '@components/ui/breadcrumb';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetServerSideProps} from 'next';
import Divider from '@components/ui/divider';
import {ProductProvider} from "../../lib/context/product-context";
import {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import medusaRequest from "../../lib/medusa-fetch";
import {AppConst} from "@utils/app-const";

interface IProductDetailsPropsType {
    product: PricedProduct;
    error?: string | undefined | null;
}

const ProductDetailsPage: React.FC<IProductDetailsPropsType> = ({product, error}) => {
    return (
        <Layout>
            <Divider/>
            <div className="pt-6 lg:pt-7 pb-10">
                <ProductProvider product={product}>
                    <Container>
                        <Breadcrumb/>
                        <ProductSingleDetails product={product}/>
                        {/* <RelatedProductFeed
                            uniqueKey="related-products"
                            className="mb-8 lg:mb-12"
                          /> */}
                        {/* <ElectronicProductFeed /> */}
                    </Container>
                </ProductProvider>
            </div>
        </Layout>
    );
};

export default ProductDetailsPage;

export const getServerSideProps: GetServerSideProps<
    IProductDetailsPropsType,
    { handle: string }
> = async ({params, locale, req}) => {
    try {
        const handle = params?.handle;

        if (!handle) {
            return {notFound: true};
        }
        const cookies = req.headers.cookie

        // const cart_id = cookies?.get(AppConst.CART_COOKIES_ID);
         console.log(req.headers.cookie)

        const res = await medusaRequest('GET', '/products', {
            query: {
                handle,
                // cart_id,
            },
        });

        console.log({res})

        if (
            !res.ok ||
            res.body.products.length === 0 ||
            Object.keys(res.body.products[0]).length === 0
        ) {
            return {notFound: true};
        }
        return {
            props: {
                product: res.body.products[0],
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
