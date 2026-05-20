// PM2 ecosystem file — must be .cjs because package.json has "type": "module"
//
// Usage on the VPS:
//   cd /var/www/breakup/backend
//   pm2 start ecosystem.config.cjs --env production
//   pm2 save && pm2 startup    # autostart at reboot
//
// The Adonis build outputs to ./build/ — that's what gets executed.
// Run `node ace build` before starting (or in the deploy script).

module.exports = {
  apps: [
    {
      name: 'breakup-api',
      script: './build/bin/server.js',
      cwd: __dirname,

      // Cluster mode — one worker per CPU core, load-balanced by PM2.
      // Set to 1 if you prefer a single process (lower memory).
      exec_mode: 'cluster',
      instances: 'max',

      // Graceful shutdown — Adonis listens to SIGTERM.
      kill_timeout: 5000,
      wait_ready: false,
      listen_timeout: 10000,

      // Logs (PM2 also keeps its own at ~/.pm2/logs)
      out_file: './logs/pm2-out.log',
      error_file: './logs/pm2-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',

      // Auto-restart on crash + soft memory cap
      autorestart: true,
      max_memory_restart: '512M',

      env_production: {
        NODE_ENV: 'production',
        // Everything else (PORT, HOST, DB_*, APP_KEY…) comes from .env
        // PM2 does NOT auto-load .env — Adonis does, via @adonisjs/env.
      },
    },
  ],
}
