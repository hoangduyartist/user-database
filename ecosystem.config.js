module.exports = {
    apps : [
        {
          name: "user-database",
          script: "./index.js",
          watch: true,
          env: {
              "HOST": "142.93.253.93",
              "PORT": 82,
              "NODE_ENV": "development"
          }
        }
    ]
  }