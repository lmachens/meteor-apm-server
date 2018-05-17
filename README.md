# APM

This project reduces the original Kadira APM to a single Meteor project and includes template MUP configuration to let you deploy to any remote server.

Most of the original features are working (like Slack alerts), but there is still a lot of work. Feel free to contribute!

## Get up and running with MUP

The easiest way to get this server up and running is to use the recommended configuration with [MUP](https://github.com/zodern/meteor-up), see below.

### Setup steps using Docker
You can also use docker to spin up an instance pretty quick:

```
docker run -d --name meteor-apm-server \
  -p 4000:80 \
  -p 7007:7007 \
  -p 11011:11011 \
  -e PORT=80 \
  -e MONGO_URL=mongodb://[your mongodb url] \
  -e MONGO_OPLOG_URL=mongodb://[your mongodb oplog url] \
  -e ROOT_URL=[e.g. monitoring.yourdomain.com] \
  strictlyskyler/meteor-apm-server:1.1.0
```

This can be useful for running an instance quickly in your own environment with orchestration.

### Setup steps using MUP

Keep in mind when using MUP: [your user account on the server must be sudoer without password](http://meteor-up.com/docs.html#ssh-based-authentication-with-sudo)

1) Clone this repo and run `meteor npm install`.

2) Copy [`mup-placeholder.js`](mup-placeholder.js) to `mup.js`. Replace the placeholder entries in the configuration with your configuration.

3) Copy [`settings-placeholder.json`](settings-placeholder.json) to `settings.json`. Change any settings as it suits your project (see *Meteor apm settings* section below)

4) Server configuration steps you need to verify prior to deployment:

   a) This setup was tested using a server with at least 512MB of RAM.

   b) Allow public access to your server on the following ports: 22, 80, 443, 7007, 11011.

   c) In order for SSL configuration to succeed, you must set setup your DNS to point to your server IP address prior to deployment. Make sure to point both `apm.YOUR_DOMAIN.com` and `apm-engine.YOUR_DOMAIN.com` to the same server IP address.

5) Run `npm run mup-deploy`.

6) Visit your APM UI page at `https://apm.YOUR_DOMAIN.com`. Login with username `admin@admin.com`, password `admin`. **CHANGE YOUR PASSWORD FROM THIS DEFAULT**.

7) In the APM web UI, create a new app and pass the settings to your Meteor app (you can copy paste from the UI):

`settings.json`
```
{
  ...
  "kadira": {
    "appId": "YOUR_APM_APP_ID",
    "appSecret": "YOUR_APM_APP_SECRET",
    "options": {
      "endpoint": "https://apm-engine.YOUR_DOMAIN.com"
    }
  },
}
```

8) Re-deploy your Meteor app, and you should see data populating in your APM UI in seconds.

## Server Restarts

The custom nginx proxy configuration does not persist through a server restart. There is no current way to hook this into MUP easily, so you will need to run `npx mup deploy` again if you need to restart the server. This should not be a problem with normal operation.

## Meteor apm settings
[`metricsLifetime`](settings.json) sets the maximum lifetime of the metrics. Old metrics are removed after each aggregation. The default value is 604800000 (1000 * 60 * 60 * 24 * 7 ^= 7 days).

As a baseline, a current Meteor application with ~500 DAL uses 0.7 GB for 7 days of APM data.

[`public.apmEngineUrl`](settings.json) refers to the endpoint URL of your application (this allows to display good hints when creating the application)

## Configuration details:

If you want to do custom configuration and server setup, here are items to be aware of:

1) A mongo replica set is required. This is set up automatically for you when using the template MUP configuration script.

2) If you are not getting APM data and see a [No 'Access-Control-Allow-Origin' header is present](https://github.com/lmachens/meteor-apm-server/issues/14) console error in your Meteor app, this is due to incorrect nginx proxy configuration. To confirm the issue, ssh into your server (`npx mup ssh`) and run `docker exec mup-nginx-proxy cat /etc/nginx/conf.d/default.conf`. Look for the upstream block for `apm-engine.YOUR_DOMAIN.com`, the entry should look like 
```
upstream apm-engine.YOUR_DOMAIN.com {
    # YOUR_APP
    server SOME_IP:11011;
}
```

   If you see port 80 for that setting, the MUP hook that tries to update this port may be failing.

## Changes to original Kadira

* Reduce to one project
* Added MongoDB indexes
* Removed MongoDB shards
* Remove raw data after processed
* Use Meteor 1.6 (Node v8)
* Removed premium packages

## ToDo

* Direct db access of alertsman (apm/server/alertsman/server.js) and remove api (apm/server/api/server.js)
* Replace invalid links to old kadira docs
