import Layout from '@components/layout/layout';
import Container from '@components/ui/container';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Divider from '@components/ui/divider';
import Seo from '@components/seo/seo';
import WithAuth from '@components/hoc/withAuth';
import { CheckoutProvider } from '@lib/context/checkout-context';
import CheckoutLoader from '@components/checkout/checkout-loader';
import CheckoutForm from '@components/checkout/checkout-form';
import CheckoutSummary from '@components/checkout/checkout-summary';

const CheckoutPage: React.FC = () => {

  return (
    <Layout>
    <CheckoutProvider>
      <Seo
        title="Checkout"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="checkout"
      />
       <Container className="py-10 2xl:py-12 border-t border-skin-base checkout">
        <div className="flex  mx-auto flex-col">
          <div className="flex flex-col xl:grid xl:grid-cols-12 grid-cols-1 flex-wrap gap-8">
            <div className="w-full col-start-1 col-end-10">
            <CheckoutLoader />
              <CheckoutForm />
              </div>
              <div className="w-full mt-7 lg:mt-0 col-start-10 col-end-13">
              <CheckoutSummary />
              </div>
          </div>
        </div>
      </Container>
      <Divider />
    </CheckoutProvider>
    </Layout>
  );
}

export const getStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};

export default WithAuth(CheckoutPage);
