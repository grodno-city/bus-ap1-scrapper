const request = require('request');
const assert = require('assert');

const ROUTES_URL = 'https://bus.ap1.by/php/getRoutes.php?city=grodno&info=01234';
const STATIONS_URL = 'https://bus.ap1.by/php/getStations.php?city=grodno&info=01234';

const createGetData = (uri) => (callback) => {
  request({ uri, json: true }, (err, response, body) => {
    if (err) {
      return callback(err);
    }

    assert.equal(response.headers['content-type'], 'text/html; charset=UTF-8');
    assert(Array.isArray(body));

    callback(null, body);
  });
}

exports.getRoutes = createGetData(ROUTES_URL);
exports.getStations = createGetData(STATIONS_URL);
