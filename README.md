# APM

This project reduces the original Kadira APM to a single Meteor project.
Most of the original features are working (like Slack alerts), but there is still a lot of work.

## Running it

```
cd apm
meteor npm i
meteor
```

This opens the following ports:

* UI: 3000
* RMA: 11011
* API: 7007

## Meteor settings
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

* Added MongoDB indexes
* Remove raw data after processed
