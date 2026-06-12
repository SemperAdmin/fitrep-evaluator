const path = require('path');
const fs = require('fs');
const vm = require('vm');

// Load js/utils.js into this context, mirroring tests/security.escapeHtml.test.js.
// utils.js is definition-only, so the vm load must not touch DOM/navigator.
const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'utils.js'), 'utf8');
vm.runInThisContext(code, { filename: 'js/utils.js' });

if (typeof global.calculateFitrepAverage !== 'function') {
  throw new Error('calculateFitrepAverage not loaded');
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected "${expected}" but got "${actual}"`);
  }
}

// The 13 core attributes (Section H "Evaluations" excluded) keyed exactly as
// calculateFitrepAverage looks them up: by trait name (case-insensitive alias).
const CORE_TRAITS = [
  'Performance',
  'Proficiency',
  'Courage',
  'Effectiveness Under Stress',
  'Initiative',
  'Leading Subordinates',
  'Developing Subordinates',
  'Setting the Example',
  'Ensuring Well-being of Subordinates',
  'Communication Skills',
  'Professional Military Education (PME)',
  'Decision Making Ability',
  'Judgment'
];

function buildResults(entries) {
  const out = {};
  entries.forEach((entry, idx) => {
    out['t' + idx] = entry;
  });
  return out;
}

// (a) 13 traits all grade B (gradeNumber 2) -> "2.00"
global.evaluationResults = buildResults(
  CORE_TRAITS.map(trait => ({ trait, grade: 'B', gradeNumber: 2 }))
);
assertEqual(global.calculateFitrepAverage(), '2.00', '13 B marks');

// (b) 14 traits incl. an observed Evals/Section-H mark -> /14 value.
// 13 B (=2) plus one Evals G (=7): total 33 / 14 = 2.357... -> "2.36".
global.evaluationResults = buildResults(
  CORE_TRAITS.map(trait => ({ trait, grade: 'B', gradeNumber: 2 }))
    .concat([{ trait: 'Evaluations', grade: 'G', gradeNumber: 7 }])
);
assertEqual(global.calculateFitrepAverage(), '2.36', '14 traits incl observed Evals');

// (c) Evals entry with gradeNumber 0 (H, non-observed) plus 13 B marks ->
// same as the 13-trait case, proving H/0 is excluded from both num and denom.
global.evaluationResults = buildResults(
  CORE_TRAITS.map(trait => ({ trait, grade: 'B', gradeNumber: 2 }))
    .concat([{ trait: 'Evaluations', grade: 'H', gradeNumber: 0 }])
);
assertEqual(global.calculateFitrepAverage(), '2.00', 'H/0 Evals excluded');

// (d) empty -> "0.00"
global.evaluationResults = {};
assertEqual(global.calculateFitrepAverage(), '0.00', 'empty results');

// Extra: string gradeNumber is coerced via Number().
global.evaluationResults = buildResults(
  CORE_TRAITS.map(trait => ({ trait, grade: 'B', gradeNumber: '2' }))
);
assertEqual(global.calculateFitrepAverage(), '2.00', 'string gradeNumber coerced');

console.log('fitrepAverage test passed');
