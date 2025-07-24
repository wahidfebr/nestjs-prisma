module.exports = {
  apps: [
    {
      name: 'nestjs-prisma',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
