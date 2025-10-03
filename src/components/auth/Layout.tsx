import Header from 'src/components/common/Header.server';
import MainProvider from 'src/components/common/MainProvider';
import Footer from 'src/components/common/Footer';
import PageForm from 'src/components/auth/PageForm';

export default function AuthLayout() {
  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn={false} />
      <MainProvider>
        <PageForm />
      </MainProvider>
      <Footer />
    </div>
  );
}
