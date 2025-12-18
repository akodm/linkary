import Header from '@/components/common/Header.server';
import Footer from '@/components/common/Footer';
import MainProvider from '@/components/common/MainProvider';
import Banner from 'src/components/home/Banner';
import Description from 'src/components/home/Description';

export default function HomeLayout() {
  return (
    <div className="flex flex-col items-center w-full relative">
      <Header />
      <MainProvider>
        <Banner />
        <Description />
      </MainProvider>
      <Footer />
    </div>
  );
}
