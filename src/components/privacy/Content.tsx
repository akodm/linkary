'use client';

import {
  PRIVACY_POLICY_CN,
  PRIVACY_POLICY_EN,
  PRIVACY_POLICY_ES,
  PRIVACY_POLICY_JP,
  PRIVACY_POLICY_KO,
} from '@/consts/privacy';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';
import Section from 'src/components/common/Section';
import Heading from 'src/components/common/Heading';
import GeneralAnimator from 'src/components/common/GeneralAnimator';

export default function Content() {
  const { i18n } = useLingui();

  const termsOfService = useMemo(() => {
    switch (i18n.locale) {
      case 'ko':
        return PRIVACY_POLICY_KO;
      case 'jp':
        return PRIVACY_POLICY_JP;
      case 'cn':
        return PRIVACY_POLICY_CN;
      case 'es':
        return PRIVACY_POLICY_ES;
      case 'en':
      default:
        return PRIVACY_POLICY_EN;
    }
  }, [i18n.locale]);

  return (
    <Section>
      <Heading>
        <h1 className="text-2xl md:text-4xl font-bold">
          {i18n.t('Privacy Policy')}
        </h1>
        <GeneralAnimator
          as="h2"
          className="text-sm md:text-lg font-medium text-gray-500"
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {i18n.t(
            'This is the Privacy Policy regarding the personal information handled by the service.',
          )}
        </GeneralAnimator>
      </Heading>
      <div className="w-full max-w-4xl">
        <div dangerouslySetInnerHTML={{ __html: termsOfService }} />
      </div>
    </Section>
  );
}
