import HeaderServer from '@/components/common/Header.server';
import Footer from '@/components/common/Footer';
import MainProvider from 'src/components/common/MainProvider';
import NotFoundContent from 'src/components/not-found/Content';

export default function NotFoundLayout() {
  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <HeaderServer isLogo isLanguage isSignIn />
      <MainProvider>
        <NotFoundContent />
        <Footer />
      </MainProvider>
    </div>
  );
}
