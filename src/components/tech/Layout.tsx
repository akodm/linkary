import Header from 'src/components/common/Header';
import MainProvider from 'src/components/common/MainProvider';
import Footer from 'src/components/common/Footer';
import Developer from 'src/components/tech/Developer';
import Technology from 'src/components/tech/Technology';
import Roadmap from 'src/components/tech/Roadmap';
import Start from 'src/components/tech/Start';

export default async function TechLayout() {
  return (
    <div className="flex flex-col items-center w-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <Developer />
        <Technology />
        <Roadmap />
        <Start />
      </MainProvider>
      <Footer />
    </div>
  );
}
