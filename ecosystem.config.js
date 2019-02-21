const ENV = process.env.NODE_ENV
if (!ENV || ['production', 'staging', 'local'].indexOf(ENV) === -1) {
  console.log('No NODE_ENV...')
  process.exit(0)
}

const dotenv = require('dotenv-safe')
const gitignore = require('parse-gitignore')

const envConfig = dotenv.config({ path: `.env.${ENV}` })
const patterns = gitignore('.gitignore')

process.on('SIGINT', function () {
  const { exec } = require('child_process')
  exec('pm2 delete all')
})

module.exports = {
  apps: [
    {
      name: 'node-boilerplate', // TODO: change this name
      script: './bin/www',
      env: envConfig,
      watch: envConfig.parsed.NODE_ENV === 'local',
      wait_ready: true,
      ignore_watch: patterns,
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      min_uptime: 10000 // 10 seconds
    }
  ]
}
