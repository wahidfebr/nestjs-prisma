module.exports = {
  apps: [
    {
      name: 'nestjs-prisma',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      node_args: '--env-file=.env',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
