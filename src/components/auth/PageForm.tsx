import MainProvider from '@/components/common/MainProvider';
import { signInWithGoogle } from '@/lib/actions/auth';
import Header from '@/components/common/Header.server';
import Footer from 'src/components/common/Footer';
import GoogleSignInButton from 'src/components/auth/GoogleSignInButton';
import AuthHeading from 'src/components/auth/Heading';
import AuthBottom from 'src/components/auth/Bottom';

export default function PageForm() {
  return (
    <div className="flex flex-col items-center w-full h-full relative">
      <Header isLogo isLanguage isSignIn={false} />
      <MainProvider>
        <section className="flex flex-col justify-center items-center w-full h-full px-4 text-center">
          <AuthHeading />
          <form
            action={signInWithGoogle}
            id="google-sign-in-form"
            className="mt-10 mb-2"
          >
            <GoogleSignInButton />
          </form>
          <AuthBottom />
        </section>
      </MainProvider>
      <Footer />
    </div>
  );
}
