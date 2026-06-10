// Initializes Sentry browser error monitoring, tracing, and session replay.
import * as Sentry from '@sentry/react'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: __SENTRY_RELEASE__,
    ignoreErrors: ['ResizeObserver loop limit exceeded'],
    integrations: [
      // Captures navigation, page-load, and request performance spans.
      Sentry.browserTracingIntegration(),
      // Records session replay data, buffering it for error-linked replays.
      Sentry.replayIntegration(),
      // Drops errors whose stack frames indicate they came from third-party code.
      Sentry.thirdPartyErrorFilterIntegration({
        filterKeys: ['dnd-resume'],
        behaviour: 'drop-error-if-contains-third-party-frames',
      }),
    ],
    // Tracing Options: https://docs.sentry.io/platforms/javascript/guides/react/tracing/
    tracesSampleRate: 0.2,
    // Session Replay Options: https://docs.sentry.io/platforms/javascript/guides/react/session-replay/
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
  })
}
