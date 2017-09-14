# Kadira Engine

This is the core service where we accept metrics from the client. This app's URL is the Kadira Endpoint we set in `meteorhacks:kadira` package.

This app connects to multiple databases. They are:

* App MongoDB (MONGO_URL) - Which has the user/app info

It's safe to run multiple instance of this for horizontal scaling.


## Setup

npm install

## Running

Add correct configurations to `../init-shell.sh`. Then apply these commands:

```sh
chmod +x run.sh
source ../init-shell.sh
sh run.sh
```
