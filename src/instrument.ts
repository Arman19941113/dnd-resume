import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: 'dnd-' + __DATE__,
    ignoreErrors: ['ResizeObserver loop limit exceeded'],
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.thirdPartyErrorFilterIntegration({
        filterKeys: ['dnd-resume'],
        behaviour: 'drop-error-if-contains-third-party-frames',
      }),
    ],
    // Tracing Options
    tracesSampleRate: 0.2,
    // Session Replay Options
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
  })
}
