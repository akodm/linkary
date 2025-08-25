import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import MainProvider from 'src/components/MainProvider';
import Banner from 'src/components/home/Banner';
import Description from 'src/components/home/Description';
import Guest from 'src/components/home/Guest';
import Tutorial from 'src/components/home/Tutorial';
import Contact from 'src/components/home/Contact';

export default function HomeLayout() {
  return (
    <>
      <Header />
      <MainProvider>
        <Banner />
        <Description />
        <Guest />
        <Tutorial />
        <Contact />
      </MainProvider>
      <Footer />
    </>
  );
}
