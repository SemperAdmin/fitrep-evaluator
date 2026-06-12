const path = require('path');
const fs = require('fs');
const vm = require('vm');

function requireScript(relPath) {
  const code = fs.readFileSync(relPath, 'utf8');
  vm.runInThisContext(code, { filename: relPath });
}

// Load utils into this context (definition-only; typeof guards keep it inert
// at load time in the Node vm).
requireScript(path.join(__dirname, '..', 'js', 'utils.js'));

if (typeof global.getAdverseFindings !== 'function') {
  throw new Error('getAdverseFindings not loaded');
}
if (typeof global.buildAdverseNoticeText !== 'function') {
  throw new Error('buildAdverseNoticeText not loaded');
}

function reset() {
  global.evaluationResults = {};
  global.evaluationMeta = {
    marineName: 'Test', fromDate: '2026-01-01', toDate: '2026-06-01', evaluatorName: 'RS'
  };
  global.selectedDirectedComments = [];
  global.directedCommentsData = {};
}

function assert(cond, msg) {
  if (!cond) throw new Error('Assertion failed: ' + msg);
}

// (1) One trait graded 'A' -> adverse; export contains the designation header.
reset();
global.evaluationResults = {
  t1: { section: 'Section D', trait: 'Performance', grade: 'A', gradeNumber: 1, justification: 'x' }
};
let f = global.getAdverseFindings();
assert(f.isAdverse === true, 'single A should be adverse');
assert(f.aTraits.length === 1 && /Section D: Performance/.test(f.aTraits[0]), 'aTraits should list the A trait');
let exp = global.buildExportText();
assert(exp.includes('ADVERSE REPORT DESIGNATION'), 'export should contain ADVERSE REPORT DESIGNATION header');

// (1a) gradeNumber stored as a string ('1') still triggers adverse (coercion).
reset();
global.evaluationResults = {
  t1: { section: 'Section D', trait: 'Performance', grade: '', gradeNumber: '1', justification: 'x' }
};
assert(global.getAdverseFindings().isAdverse === true, 'string gradeNumber "1" should be adverse');

// (1b) Single 'A' among F/G marks still adverse.
reset();
global.evaluationResults = {
  t1: { section: 'Section D', trait: 'Performance', grade: 'F', gradeNumber: 6, justification: 'x' },
  t2: { section: 'Section D', trait: 'Proficiency', grade: 'A', gradeNumber: 1, justification: 'x' },
  t3: { section: 'Section E', trait: 'Courage', grade: 'G', gradeNumber: 7, justification: 'x' }
};
assert(global.getAdverseFindings().isAdverse === true, 'A among F/G still adverse');

// (2) All grades B-G, no directed comments -> not adverse; export lacks header.
reset();
global.evaluationResults = {
  t1: { section: 'Section D', trait: 'Performance', grade: 'B', gradeNumber: 2, justification: 'x' },
  t2: { section: 'Section D', trait: 'Proficiency', grade: 'C', gradeNumber: 3, justification: 'x' },
  t3: { section: 'Section E', trait: 'Courage', grade: 'G', gradeNumber: 7, justification: 'x' }
};
f = global.getAdverseFindings();
assert(f.isAdverse === false, 'B-G marks with no comments should not be adverse');
exp = global.buildExportText();
assert(!exp.includes('ADVERSE REPORT DESIGNATION'), 'export should NOT contain the header when not adverse');

// (2b) Low average alone is not a trigger (anti-false-positive md:5171-5190).
reset();
global.evaluationResults = {
  t1: { section: 'Section D', trait: 'Performance', grade: 'F', gradeNumber: 6, justification: 'x' },
  t2: { section: 'Section D', trait: 'Proficiency', grade: 'G', gradeNumber: 7, justification: 'x' }
};
assert(global.getAdverseFindings().isAdverse === false, 'low average alone is not adverse');

// (3) selectedDirectedComments=['not_recommended'] with no A -> adverse.
reset();
global.evaluationResults = {
  t1: { section: 'Section D', trait: 'Performance', grade: 'B', gradeNumber: 2, justification: 'x' }
};
global.selectedDirectedComments = ['not_recommended'];
f = global.getAdverseFindings();
assert(f.isAdverse === true, 'not_recommended directed comment should be adverse');
assert(f.reasons.some(r => /Not recommended for promotion/.test(r)), 'reason should mention not recommended');

// (4) body_composition with the exceeds option -> adverse; in-standards -> not.
reset();
global.evaluationResults = {
  t1: { section: 'Section D', trait: 'Performance', grade: 'B', gradeNumber: 2, justification: 'x' }
};
global.selectedDirectedComments = ['body_composition'];
global.directedCommentsData = { body_composition: { selectedOption: 'exceeds_whtr_and_body_fat' } };
assert(global.getAdverseFindings().isAdverse === true, 'body_composition exceeds option should be adverse');

global.directedCommentsData = { body_composition: { selectedOption: 'whtr_in_standards' } };
assert(global.getAdverseFindings().isAdverse === false, 'body_composition in-standards option should NOT be adverse');

// (4b) body_composition with no option selected -> not adverse.
global.directedCommentsData = { body_composition: {} };
assert(global.getAdverseFindings().isAdverse === false, 'body_composition with no option should not be adverse');

console.log('adverse findings test passed');
