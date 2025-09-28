module.exports = {
  apps: [
    {
      name: "invoke-riquex",
      script: "dist/index.js",
      interpreter: "node",
      watch: false,
      max_memory_restart: "500M", 
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};