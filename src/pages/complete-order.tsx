import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import OrderInformation from '@components/order/order-information';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Divider from '@components/ui/divider';
import Seo from '@components/seo/seo';
import WithAuth from '@components/hoc/withAuth';
import { useRouter } from 'next/router';
import { useOrder } from 'medusa-react';

const Order: React.FC = () => {
  const router = useRouter();
  const {id} = router.query;

  if(!id && typeof id !== 'string'){
    return null
  }

  const { 
    order, 
    isLoading, 
  } = useOrder(id as string)

  if(isLoading){
    return <div>Loading...</div>
  }

  if(!order){
    router.push("/404")
  }

  return (
    <Layout>
      <Seo
        title="Order"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="complete-order"
      />
      <Divider />
      <Container>
        {order &&
        <OrderInformation order={order} />
        }
      </Container>
      <Divider />
    </Layout>
  );
}

export default WithAuth(Order)


export const getServerSideProps: GetServerSideProps = async ({locale}) => {
      return {
        props: {
            ...(await serverSideTranslations(locale!, [
              'common',
              'forms',
              'menu',
              'footer',
            ])),
        },
      };
    }