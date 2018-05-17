// Copy this file to mup.js and replace placeholders with your info
module.exports = {
  servers: {
    one: {
      host: 'YOUR_SERVER_IP',
      username: 'ubuntu',
      pem: '~/.ssh/id_rsa.YOUR_PRIVATE_SSH_KEY'
    }
  },

  app: {
    name: 'YOUR_APP-apm',
    path: '.',
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true
    },
    env: {
      ROOT_URL: 'https://apm.YOUR_DOMAIN.com',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
      MAIL_URL: ''
    },
    docker: {
      image: 'abernix/meteord:node-8.9.3-base',
      args: [
        '-p 11011:11011', // Open up the engine port
        '--log-driver json-file', // Without these the Docker log file for Mongo will exhaust disk space
        '--log-opt max-size=100m',
        '--log-opt max-file=3'
      ]
    },
    enableUploadProgressBar: true
  },

  proxy: {
    domains: 'apm.YOUR_DOMAIN.com,apm-engine.YOUR_DOMAIN.com',
    ssl: {
      forceSSL: true,
      letsEncryptEmail: 'contact@YOUR_DOMAIN.com'
    }
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },

  hooks: {
    // Using remoteCommand would be simpler here, but it was not working
    'post.meteor.start'(api) {
      return api.runSSHCommand(
        api.getConfig().servers.one,
        "docker exec mup-nginx-proxy sed -i '0,/server.*:80/ s/\\(server.*:\\)80/\\111011/1' /etc/nginx/conf.d/default.conf && docker exec mup-nginx-proxy nginx -s reload"
      );
    }
  }
};
