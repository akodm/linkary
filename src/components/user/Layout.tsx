import { SelectUser } from '@/db/schemas/users';
import Header from '@/components/common/Header.server';
import MainProvider from 'src/components/common/MainProvider';
import Footer from 'src/components/common/Footer';
import UserContent from 'src/components/user/Content';

interface UserLayoutProps {
  user?: SelectUser | null;
}

export default function UserLayout({ user = null }: UserLayoutProps) {
  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn />
      <MainProvider>
        <UserContent user={user} />
      </MainProvider>
      <Footer />
    </div>
  );
}
