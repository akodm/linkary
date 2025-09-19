'use client';

import {
  TERMS_OF_SERVICE_KO,
  TERMS_OF_SERVICE_EN,
  TERMS_OF_SERVICE_JP,
  TERMS_OF_SERVICE_CN,
  TERMS_OF_SERVICE_ES,
} from '@/consts/terms-of-service';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';
import GeneralAnimator from 'src/components/common/GeneralAnimator';
import Heading from 'src/components/common/Heading';
import Section from 'src/components/common/Section';

export default function Content() {
  const { i18n } = useLingui();

  const termsOfService = useMemo(() => {
    switch (i18n.locale) {
      case 'ko':
        return TERMS_OF_SERVICE_KO;
      case 'jp':
        return TERMS_OF_SERVICE_JP;
      case 'cn':
        return TERMS_OF_SERVICE_CN;
      case 'es':
        return TERMS_OF_SERVICE_ES;
      case 'en':
      default:
        return TERMS_OF_SERVICE_EN;
    }
  }, [i18n.locale]);

  return (
    <Section>
      <Heading>
        <h1 className="text-2xl md:text-4xl font-bold">
          {i18n.t('Terms of Service')}
        </h1>
        <GeneralAnimator as="h2" className="text-base md:text-lg my-0!">
          {i18n.t('These are the Terms of Service for using the service.')}
        </GeneralAnimator>
      </Heading>
      <div className="w-full max-w-4xl">
        <div dangerouslySetInnerHTML={{ __html: termsOfService }} />
      </div>
    </Section>
  );
}
