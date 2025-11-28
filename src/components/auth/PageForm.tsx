'use client';

import GoogleSignInButton from 'src/components/auth/GoogleSignInButton';
import AuthHeading from 'src/components/auth/Heading';
import AuthBottom from 'src/components/auth/Bottom';
import { useEffect, useState } from 'react';
import BackDropLoader from 'src/components/common/BackDropLoader';
import { signInWithGoogle } from '@/lib/actions/auth';

export default function PageForm() {
  const [loading, setLoading] = useState(false);

  const onSignInWithGoogle = () => {
    setLoading(true);
    signInWithGoogle('/auth/success');
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  return (
    <section className="flex flex-col justify-center items-center w-full h-full px-4 text-center">
      <AuthHeading />
      <form
        action={onSignInWithGoogle}
        id="google-sign-in-form"
        className="mt-10 mb-2"
      >
        <GoogleSignInButton />
        {loading && <BackDropLoader />}
      </form>
      <AuthBottom />
    </section>
  );
}
