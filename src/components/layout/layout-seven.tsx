import Header from '@components/layout/header/header-six';
import Footer from '@components/layout/footer/footer7';
import { useTranslation } from 'next-i18next';
import MobileNavigation from '@components/layout/mobile-navigation/mobile-navigation';
import BackToTopButton from "@components/ui/back-to-top";

const Layout: React.FC = ({ children }) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className="relative flex-grow bg-zinc-100"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
      <Footer />
      <BackToTopButton />
      <MobileNavigation />
    </div>
  );
};

export default Layout;
