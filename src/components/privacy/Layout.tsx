import Footer from 'src/components/common/Footer';
import Header from '@/components/common/Header.server';
import MainProvider from 'src/components/common/MainProvider';
import Content from 'src/components/privacy/Content';

export default function PrivacyLayout() {
  return (
    <div className="flex flex-col items-center w-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <Content />
      </MainProvider>
      <Footer />
    </div>
  );
}
