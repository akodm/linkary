import Header from '@/components/common/Header.server';
import MainProvider from 'src/components/common/MainProvider';
import Footer from 'src/components/common/Footer';
import UserLoader from '@/components/user/Loader';
import { GetUserActionResponse } from '@/lib/actions/user';

interface UserLayoutProps {
  user?: GetUserActionResponse | null;
}

export default function UserLayout({ user }: UserLayoutProps) {
  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <UserLoader user={user} />
      </MainProvider>
      <Footer />
    </div>
  );
}
