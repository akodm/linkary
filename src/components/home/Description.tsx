'use client';

import { useLingui } from '@lingui/react';

export default function Description() {
  const { i18n } = useLingui();

  return (
    <section className="flex flex-col items-center w-full">
      <div className="flex flex-col items-center md:gap-y-20 w-full max-w-320 px-2 md:px-4 mx-auto">
        <div className="flex flex-col items-center w-full">
          <h2>{i18n.t('')}</h2>
          <h3>{i18n.t('')}</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-5 w-full"></div>
      </div>
    </section>
  );
}
