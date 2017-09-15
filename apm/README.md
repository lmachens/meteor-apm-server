# Kadira UI

This is the main UI of kadira.

This app connects to multiple databases. They are:

* App MongoDB (MONGO_URL) - Which has the user/app info

It's safe to run multiple instance of this for horizontal scaling.

## Running

Add correct configurations to `../init-shell.sh`.
Configure `settings.json` as needed.

Then apply these commands:

```sh
chmod +x run.sh
source ../init-shell.sh
sh run.sh
```
