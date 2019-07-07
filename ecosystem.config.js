module.exports = {
    apps : [
        {
          name: "user-database",
          script: "./index.js",
          watch: true,
          env: {
              "HOST": window.location.hostname, //only using pm2
              "PORT": 82,
              "NODE_ENV": "development"
          }
        }
    ]
  }