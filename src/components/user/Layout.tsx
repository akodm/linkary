import Header from '@/components/common/Header.server';
import MainProvider from 'src/components/common/MainProvider';
import Footer from 'src/components/common/Footer';
import UserLoader from '@/components/user/Loader';
import { GetUserActionResponse } from '@/lib/actions/user';

interface UserLayoutProps {
  user?: GetUserActionResponse | null;
  recovery?: { check: boolean; value: boolean };
}

export default function UserLayout({ user, recovery }: UserLayoutProps) {
  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <UserLoader user={user} recovery={recovery} />
      </MainProvider>
      <Footer />
    </div>
  );
}
