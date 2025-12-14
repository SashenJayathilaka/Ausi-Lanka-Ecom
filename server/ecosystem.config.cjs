module.exports = {
  apps: [
    {
      name: "server",
      script: "npm",
      args: "start", // Uses 'npm start' which runs 'node dist/index.js'
      env: {
        NODE_ENV: "production",
        PORT: 80,
        // Add your Inngest keys here (Get these from inngest.com)
        INNGEST_EVENT_KEY: "your_event_key_here",
        INNGEST_SIGNING_KEY: "your_signing_key_here",
      },
    },
  ],
};
