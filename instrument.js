// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://3b2cd1d9153eb0c047f5ba8c5ab36eec@o4507342922645504.ingest.us.sentry.io/4507377919524864",
  environment: "QA",
  integrations: [
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  ignoreErrors: ["fb_xd_fragment", 'session is not defined'],
  
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (
      error &&
      error.message &&
      error.message.match('session is not defined')
    ) {
      // event.fingerprint = ["database-unavailable"];      
    }
    return event;
  },

});

// Password or username is incorrect


