'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function Home() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <main className="flex flex-col gap-y-5 justify-center items-center w-full h-full bg-white dark:bg-black">
      <h1>{'hello world'}</h1>
      <button onClick={toggleTheme} className="absolute top-4 right-4">
        <SunIcon className="w-4 h-4 hidden dark:block" />
        <MoonIcon className="w-4 h-4 dark:hidden" />
      </button>
    </main>
  );
}
