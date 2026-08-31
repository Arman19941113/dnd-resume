// Initializes Sentry browser error monitoring, tracing, and session replay.
import * as Sentry from '@sentry/react'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: SENTRY_RELEASE,
    // Preserve the v10 data collection defaults when upgrading to v11.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: {
        request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
        response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      },
      httpBodies: [],
      urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      graphQL: { document: false, variables: false },
    },
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
    traceLifecycle: 'static',
    tracesSampleRate: 0.2,
    // Session Replay Options: https://docs.sentry.io/platforms/javascript/guides/react/session-replay/
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
  })
}
