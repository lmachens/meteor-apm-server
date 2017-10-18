timeDefToISODate = function(timeDef) {
  var dateString =
    timeDef.y +
    '-' +
    toTwoValue(timeDef.M) +
    '-' +
    toTwoValue(timeDef.d) +
    'T' +
    toTwoValue(timeDef.h || 0) +
    ':' +
    toTwoValue(timeDef.m || 0) +
    ':00Z';

  return Date(dateString);
};

toTwoValue = function(val) {
  if (val < 10) {
    return '0' + val;
  } else {
    return '' + val;
  }
};

getTimeDef = function(res) {
  var timeDef = {
    y: { $year: '$value.startTime' },
    M: { $month: '$value.startTime' },
    d: { $dayOfMonth: '$value.startTime' }
  };

  if (res == '1min') {
    timeDef.h = { $hour: '$value.startTime' };
    timeDef.m = { $minute: '$value.startTime' };
  }

  return timeDef;
};

normalizeToMin = function(time) {
  var diff = time % (1000 * 60);
  return new Date(time - diff);
};

timeRound = function(time, PROFILE) {
  diff = time % PROFILE.timeRange;
  time = time - diff;
  return time;
};
