const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {
  ALL_OCCASIONS,
  RANK_ALLOWED_OCCASIONS,
  getAllowedOccasions,
  validateRankOccasion
} = require('../js/formValidationCore.js');

// Minimal polyfill for test runner environments without Mocha/Jest.
if (typeof global.describe !== 'function') {
  global.describe = (name, fn) => { fn(); };
}
if (typeof global.it !== 'function') {
  global.it = (name, fn) => {
    try {
      const res = fn();
      if (res && typeof res.then === 'function') {
        res.then(() => {}).catch(e => { console.error(e); process.exit(1); });
      }
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  };
}

describe('rank-aware occasion validation (MCO 1610.7B ch. 3)', () => {
  it('SA is valid for lieutenants only', () => {
    assert.strictEqual(validateRankOccasion('2ndLt', 'SA').valid, true);
    assert.strictEqual(validateRankOccasion('1stLt', 'SA').valid, true);
    assert.strictEqual(validateRankOccasion('Sgt', 'SA').valid, false);
    assert.strictEqual(validateRankOccasion('CWO5', 'SA').valid, false);
    assert.strictEqual(validateRankOccasion('Capt', 'SA').valid, false);
    assert.strictEqual(validateRankOccasion('Col', 'SA').valid, false);
  });

  it('SA rejection message names the lieutenant-only rule', () => {
    const res = validateRankOccasion('Sgt', 'SA');
    assert.ok(/Lieutenant/i.test(res.message));
  });

  it('AN excludes lieutenants but is valid for others', () => {
    assert.strictEqual(validateRankOccasion('2ndLt', 'AN').valid, false);
    assert.strictEqual(validateRankOccasion('1stLt', 'AN').valid, false);
    assert.strictEqual(validateRankOccasion('Sgt', 'AN').valid, true);
    assert.strictEqual(validateRankOccasion('Capt', 'AN').valid, true);
    assert.strictEqual(validateRankOccasion('BGen', 'AN').valid, true);
  });

  it('MajGen allows exactly CH,TR,GC,TD,FD', () => {
    const allowed = getAllowedOccasions('MajGen');
    assert.deepStrictEqual([...allowed].sort(), ['CH', 'FD', 'GC', 'TD', 'TR']);
    ['CH', 'TR', 'GC', 'TD', 'FD'].forEach(c => {
      assert.strictEqual(validateRankOccasion('MajGen', c).valid, true);
    });
    assert.strictEqual(validateRankOccasion('MajGen', 'AN').valid, false);
    assert.strictEqual(validateRankOccasion('MajGen', 'SA').valid, false);
  });

  it('BGen adds AN to the MajGen set', () => {
    const allowed = getAllowedOccasions('BGen');
    assert.deepStrictEqual([...allowed].sort(), ['AN', 'CH', 'FD', 'GC', 'TD', 'TR']);
  });

  it('Gen and LtGen allow no occasions', () => {
    assert.deepStrictEqual(getAllowedOccasions('Gen'), []);
    assert.deepStrictEqual(getAllowedOccasions('LtGen'), []);
    assert.strictEqual(validateRankOccasion('Gen', 'CH').valid, false);
    assert.strictEqual(validateRankOccasion('LtGen', 'CH').valid, false);
    assert.ok(/General/i.test(validateRankOccasion('Gen', 'CH').message));
  });

  it('empty rank or occasion is treated as valid', () => {
    assert.strictEqual(validateRankOccasion('', 'SA').valid, true);
    assert.strictEqual(validateRankOccasion('Sgt', '').valid, true);
    assert.strictEqual(validateRankOccasion('', '').valid, true);
  });

  it('unknown rank fails open', () => {
    assert.strictEqual(getAllowedOccasions('Foo'), null);
    assert.strictEqual(validateRankOccasion('Foo', 'SA').valid, true);
  });

  it('DRIFT GUARD: index.html rank/occasion options stay in sync with the map', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

    function optionValues(selectId) {
      const open = new RegExp('<select[^>]*id="' + selectId + '"', 'i');
      const startMatch = open.exec(html);
      assert.ok(startMatch, 'select #' + selectId + ' not found in index.html');
      const from = startMatch.index;
      const end = html.indexOf('</select>', from);
      assert.ok(end !== -1, 'unterminated <select> for #' + selectId);
      const block = html.slice(from, end);
      const values = [];
      const re = /<option\s+value="([^"]*)"/g;
      let m;
      while ((m = re.exec(block)) !== null) values.push(m[1]);
      return values;
    }

    const ranks = optionValues('marineRankSelect').filter(v => v !== '');
    const occasions = optionValues('evaluationOccasionSetup').filter(v => v !== '');

    assert.ok(ranks.length > 0, 'no rank options parsed');
    assert.ok(occasions.length > 0, 'no occasion options parsed');

    ranks.forEach(rank => {
      assert.ok(
        Object.prototype.hasOwnProperty.call(RANK_ALLOWED_OCCASIONS, rank),
        'rank option "' + rank + '" missing from RANK_ALLOWED_OCCASIONS'
      );
    });

    occasions.forEach(code => {
      assert.ok(
        ALL_OCCASIONS.indexOf(code) !== -1,
        'occasion option "' + code + '" missing from ALL_OCCASIONS'
      );
    });
  });
});
