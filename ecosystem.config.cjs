module.exports = {
  apps: [
    {
      name: "velora-events",
      port: 3005,
      exec_mode: "cluster",
      instances: 1,
      script: "./.output/server/index.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
        UV_THREADPOOL_SIZE: 128,
        NODE_OPTIONS: "--max-old-space-size=2048",
      },
      env_file: ".env",
      watch: false,
      max_memory_restart: "1024M",
      restart_delay: 3000,
      max_restarts: 10,
      min_uptime: "10s",
      out_file: "/var/log/pm2/velora-events-out.log",
      error_file: "/var/log/pm2/velora-events-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
      kill_timeout: 10000,
      shutdown_with_message: true,
    },
  ],
};
