const rxjs = require('rxjs');
const { groupBy } = require('rxjs/operators');

module.exports = {
  Observable: rxjs.Observable,
  groupBy,
};
