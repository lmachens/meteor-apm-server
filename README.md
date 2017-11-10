# APM

This project reduces the original Kadira APM to a single Meteor project.
Most of the original features are working (like Slack alerts), but there is still a lot of work.
Feel free to contribute!

## Running it

A mongo replica set is required!

```
cd apm
meteor npm i
meteor
```

This opens the following ports:

* UI: 3000
* RMA: 11011
* API: 7007

## Login

username: admin@admin.com  
password: admin  

## Meteor apm settings
`metricsLifetime` sets the maximum lifetime of the metrics. Old metrics are removed after each aggregation.
The default value is 604800000 (1000 * 60 * 60 * 24 * 7 ^= 7 days).

```
"metricsLifetime": 604800000
```

## Meteor client settings
```
"kadira": {
    "appId": "...",
    "appSecret": "...",
    "options": {
        "endpoint": "http://localhost:11011"
    }
},
```

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