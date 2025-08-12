module.exports = {
  apps: [
    {
      name: "server",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
