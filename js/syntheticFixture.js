/**
 * FITREP Evaluator - Synthetic Data Fixture
 *
 * PROOF OF CONCEPT. NOT A SYSTEM OF RECORD.
 *
 * This fixture is the only acceptable input source for the PoC. All personas
 * use a clearly-fake naming convention (MARINE_ALPHA_##) so a reviewer cannot
 * confuse them with real Marines on the file system or in screenshots.
 *
 * Do not modify this file to include real names, real EDIPIs, or real ranks
 * tied to identifiable individuals. Doing so violates paragraph 4.a of the
 * PoC Charter Memo and converts the PoC into an unauthorized live system.
 *
 * Naming convention rule: prefix MARINE_ALPHA_ through MARINE_ZULU_ with a
 * two-digit ordinal. Period strings use the format YYYY-Q# only.
 */
(function () {
  'use strict';

  const SYNTHETIC_MARINES = [
    {
      id: 'MARINE_ALPHA_01',
      displayName: 'MARINE_ALPHA_01',
      rank: 'Sgt',
      period: '2025-Q4',
      notes: 'Synthetic NCO persona for trait-evaluation demonstration.'
    },
    {
      id: 'MARINE_BRAVO_02',
      displayName: 'MARINE_BRAVO_02',
      rank: 'SSgt',
      period: '2025-Q4',
      notes: 'Synthetic SNCO persona for left-to-right methodology walkthrough.'
    },
    {
      id: 'MARINE_CHARLIE_03',
      displayName: 'MARINE_CHARLIE_03',
      rank: 'GySgt',
      period: '2026-Q1',
      notes: 'Synthetic GySgt persona for advanced-grade methodology walkthrough.'
    },
    {
      id: 'MARINE_DELTA_04',
      displayName: 'MARINE_DELTA_04',
      rank: 'WO',
      period: '2026-Q1',
      notes: 'Synthetic WO persona for officer-grade methodology walkthrough.'
    },
    {
      id: 'MARINE_ECHO_05',
      displayName: 'MARINE_ECHO_05',
      rank: '1stLt',
      period: '2026-Q1',
      notes: 'Synthetic company-grade officer persona.'
    },
    {
      id: 'MARINE_FOXTROT_06',
      displayName: 'MARINE_FOXTROT_06',
      rank: 'Capt',
      period: '2026-Q1',
      notes: 'Synthetic company-grade officer persona at higher seniority.'
    },
    {
      id: 'MARINE_GOLF_07',
      displayName: 'MARINE_GOLF_07',
      rank: 'Maj',
      period: '2026-Q1',
      notes: 'Synthetic field-grade officer persona.'
    },
    {
      id: 'MARINE_HOTEL_08',
      displayName: 'MARINE_HOTEL_08',
      rank: 'LtCol',
      period: '2026-Q1',
      notes: 'Synthetic field-grade officer persona at higher seniority.'
    }
  ];

  /**
   * Validate a persona to ensure no real-looking data slipped in.
   * Returns true if the persona conforms to the synthetic naming rule.
   */
  function isSynthetic(persona) {
    if (!persona || typeof persona !== 'object') return false;
    if (typeof persona.id !== 'string') return false;
    if (!/^MARINE_[A-Z]+_\d{2}$/.test(persona.id)) return false;
    if (persona.displayName !== persona.id) return false;
    return true;
  }

  /**
   * Get the full fixture, validated.
   */
  function getFixture() {
    const valid = SYNTHETIC_MARINES.filter(isSynthetic);
    if (valid.length !== SYNTHETIC_MARINES.length) {
      const bad = SYNTHETIC_MARINES.filter(p => !isSynthetic(p));
      console.error('[fixture] Non-synthetic persona detected and dropped:', bad);
    }
    return valid;
  }

  if (typeof window !== 'undefined') {
    window.SYNTHETIC_FIXTURE = Object.freeze(getFixture());
    Object.freeze(window.SYNTHETIC_FIXTURE);
    console.log('[fixture] PoC synthetic fixture loaded. Personas:', window.SYNTHETIC_FIXTURE.length);
  }
})();
