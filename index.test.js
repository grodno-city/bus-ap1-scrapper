const { getRoutes, getStations } = require('./index');

function inferTypes (typeMap, obj) {
  Object.keys(obj).forEach((key) => {
    if (!typeMap[key]) {
      typeMap[key] = {
        count: 0,
        types: {
          // type: count
        },
        values: { /* value: count */ }
      };
    }

    const value = obj[key];
    const valueType = typeof value;
    const stats = typeMap[key];

    if (!stats.types[valueType]) {
      stats.types[valueType] = 0;
    }

    if (!stats.values[value]) {
      stats.values[value] = 0;
    }

    stats.count += 1;
    stats.types[valueType] += 1;
    stats.values[value] += 1;
  });

  return typeMap;
}

function reduceTypeStats(stats) {
  return Object.keys(stats).map((key) => {
    const keyStats = stats[key];

    const groupValues = Object.entries(keyStats.values).filter(([key, value]) => {
      return value > 1;
    });

    const reducedStats = {
      count: keyStats.count,
      types: keyStats.types,
    };

    if (groupValues.length > 0) {
      if (groupValues.length < (keyStats.count / 10)) {
        reducedStats.groupValues = groupValues;
      }
    } else {
      reducedStats.unique = true;
    }

    return [
      key,
      reducedStats,
    ];
  });
}

function log(data) {
  console.log(JSON.stringify(data, null, 2));
}

function getCollectionStats(collection) {
  return reduceTypeStats(collection.reduce(inferTypes, {}));
}

getRoutes(function (err, routes) {
  console.log('getRoutes', err, routes && routes.length);
  if (!err) {
    log(getCollectionStats(routes));
  }
});

getStations(function (err, stations) {
  console.log('getStations', err, stations && stations.length);
  if (!err) {
    log(getCollectionStats(stations));
  }
});
