import Layout from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import OrderDetails from '@components/order/order-details';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useOrder } from 'medusa-react';

export default function OrderPage() {
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
  } else return (
    <AccountLayout>
      <OrderDetails order={order} className="p-0" />
    </AccountLayout>
  );
}

OrderPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}: any) => {
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
