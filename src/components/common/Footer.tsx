'use client';

import { useLingui } from '@lingui/react';
import { ContactIcon, FileCheckIcon, FileUserIcon } from 'lucide-react';
import I18nLink from 'src/components/common/I18nLink';

export default function Footer() {
  const { i18n } = useLingui();

  return (
    <footer className="flex flex-col items-start md:items-center gap-3 md:gap-5 w-full px-5 py-10 border-t border-border bg-blue-500">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 w-full md:w-fit text-left">
        <span className="mx-auto md:mx-0 text-xs md:text-sm text-gray-300">
          {i18n.t('© 2025 Linkary. All rights reserved.')}
        </span>
        <div className="flex flex-row items-center gap-x-1.5">
          <FileCheckIcon size={14} className="text-white" />
          <I18nLink href="/terms-of-service">
            <span className="underline text-sm md:text-base text-white hover:text-gray-200 transition-colors duration-200">
              {i18n.t('Terms of Service')}
            </span>
          </I18nLink>
        </div>
        <div className="flex flex-row items-center gap-x-1.5">
          <FileUserIcon size={14} className="text-white" />
          <I18nLink href="/privacy">
            <span className="underline text-sm md:text-base text-white hover:text-gray-200 transition-colors duration-200">
              {i18n.t('Privacy Policy')}
            </span>
          </I18nLink>
        </div>
        <div className="flex flex-row items-center gap-x-1.5">
          <ContactIcon size={14} className="text-white" />
          <a
            href="mailto:a8456452@gmail.com"
            className="underline text-sm md:text-base text-white hover:text-gray-200 transition-colors duration-200"
          >
            {i18n.t('Contact Us')}
          </a>
        </div>
      </div>
      <div className="flex flex-row flex-wrap items-center gap-x-1.5 mx-auto">
        <span className="text-xs text-gray-300">
          {i18n.t('Site created by 🤖 akodm')}
        </span>
        <a
          href="https://github.com/akodm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="underline text-xs md:text-sm text-white hover:text-gray-200 transition-colors duration-200">
            {'https://github.com/akodm'}
          </span>
        </a>
      </div>
    </footer>
  );
}
