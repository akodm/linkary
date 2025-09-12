import Footer from 'src/components/common/Footer';
import Header from 'src/components/common/Header';
import MainProvider from 'src/components/common/MainProvider';
import Banner from 'src/components/about/Banner';
import Description from 'src/components/about/Description';
import Content from 'src/components/about/Content';
import Infomation from 'src/components/about/Infomation';

export default function AboutLayout() {
  return (
    <div className="flex flex-col items-center w-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <Banner />
        <Description />
        <Content />
        <Infomation />
      </MainProvider>
      <Footer />
    </div>
  );
}
