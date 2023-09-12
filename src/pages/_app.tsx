import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ManagedUIContext } from '@contexts/ui.context';
import ManagedModal from '@components/common/modal/managed-modal';
import ManagedDrawer from '@components/common/drawer/managed-drawer';
import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from 'react-query/devtools';
import { appWithTranslation } from 'next-i18next';
import { DefaultSeo } from '@components/seo/default-seo';


// external
import 'react-toastify/dist/ReactToastify.css';

// base css file
import '@styles/scrollbar.css';
import '@styles/swiper-carousel.css';
import '@styles/custom-plugins.css';
import '@styles/tailwind.css';
import '@styles/themes.scss';
import { getDirection } from '@utils/get-direction';
import {CartProvider, MedusaProvider} from "medusa-react";
import {MEDUSA_BACKEND_URL,queryClient} from "@lib/config";
import {CartDropdownProvider} from "@lib/context/cart-dropdown-context";
import {StoreProvider} from "@lib/context/store-context";

const Noop: React.FC = ({ children }) => <>{children}</>;

const CustomApp = ({ Component, pageProps }: AppProps) => {
  const queryClientRef = useRef<any>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const router = useRouter();
  const dir = getDirection(router.locale);
  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);
  const Layout = (Component as any).Layout || Noop;

  return (
      <QueryClientProvider client={queryClientRef.current}>
        <MedusaProvider
            baseUrl={MEDUSA_BACKEND_URL}
            queryClientProviderProps={{
              client: queryClient,
            }}
        >
          <Hydrate state={pageProps.dehydratedState}>
            <CartDropdownProvider>
              <CartProvider>
                <StoreProvider>
                  <ManagedUIContext>
                    <>
                      <DefaultSeo />
                      <Layout pageProps={pageProps}>
                        <Component {...pageProps} key={router.route} />
                      </Layout>
                      <ToastContainer />
                      <ManagedModal />
                      <ManagedDrawer />
                    </>
                  </ManagedUIContext>
                </StoreProvider>
              </CartProvider>
            </CartDropdownProvider>
          </Hydrate>
          {/* <ReactQueryDevtools /> */}
        </MedusaProvider>
      </QueryClientProvider>
  );
};

export default appWithTranslation(CustomApp);
