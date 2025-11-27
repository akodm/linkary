// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { initBotId } from 'botid/client/core';

Sentry.init({
  dsn: 'https://63fce574c8134c4b334c2200ac9ac27e@o4509829296422912.ingest.us.sentry.io/4509829359796224',

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

initBotId({
  protect: [
    {
      path: '/api/**/*',
      method: 'POST',
    },
    {
      path: '/api/**/*',
      method: 'PUT',
    },
    {
      path: '/api/**/*',
      method: 'DELETE',
    },
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
