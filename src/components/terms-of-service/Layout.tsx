import Footer from 'src/components/common/Footer';
import Header from '@/components/common/Header.server';
import MainProvider from 'src/components/common/MainProvider';
import Content from 'src/components/terms-of-service/Content';

export default function TermsOfServiceLayout() {
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
