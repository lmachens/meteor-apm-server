# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/).

## [1.2.0] - 2018-05-17
- Added `Meteor.settings.public.apmEngineUrl` to help client configuration [#35](https://github.com/lmachens/meteor-apm-server/pull/35) Thx @vparpoil

## [1.1.0] - 2018-04-07
- Update Meteor to 1.6.1.1
- Remove 'signin with email' [#27](https://github.com/lmachens/meteor-apm-server/pull/27) Thx @ramezrafla
- Updated README Thx @StrictlySkyler and @markreid

## [1.0.8] - 2018-02-27
- BREAKING CHANGE: Merged package.json and moved meteor files to top level. You should update your mup scripts and point to this directory instead of `/apm`.
- Adding  mongo indexes to improve cpu usage [#23](https://github.com/lmachens/meteor-apm-server/pull/23) Thx @jasongrishkoff
- Provide working MUP deployment template and guide [#25](https://github.com/lmachens/meteor-apm-server/pull/25) Thx @jehartzog
- Update npm dependencies.
- Update Meteor to 1.6.1.
- Fixed `MongoOplog is not a constructor`.
- Removed Segment.io package.

## [1.0.7] - 2018-01-23
### Fixed
- Fix aggregation bug [#17](https://github.com/lmachens/meteor-apm-server/pull/17)

## [1.0.6] - 2018-01-19
### Changed
- Call aggregation for 30min and 3hour profiles only when needed to reduce server load. Thx @jehartzog [#16](https://github.com/lmachens/meteor-apm-server/pull/16)
- Remove console.logs which is the reason for large log files.

## [1.0.5] - 2017-12-12
### Changed
- Update Meteor to 1.6.0.1

## [1.0.4] - 2017-11-16
### Changed
- Cleanup is optimized and called after each aggregation interval.
- Make sure that the previous aggregation is finished before starting the next ones.

## [1.0.3] - 2017-11-10
### Added
- Meteor.settings.metricsLifetime to set maximum lifetime of metrics.
  The default is 7 days (604800000 = 1000 * 60 * 60 * 24 * 7).

## [1.0.2] - 2017-11-10
### Changed
- Optimized indexes of metrics collections.
- package.json name and description.
### Removed
- Unused collection ProdStats.

## [1.0.1] - 2017-11-09
### Added
- This changelog file.

### Changed
- Updated Meteor to 1.6.