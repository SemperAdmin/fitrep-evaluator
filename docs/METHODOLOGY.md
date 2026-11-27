# Marking methodology

The FITREP Evaluator demonstrates a left-to-right marking framework intended to reduce grade inflation and confirmation bias. This page holds the method detail; the README has the short summary.

The application demonstrates a left-to-right FITREP marking framework intended to reduce grade inflation and confirmation bias.

- Start at the baseline trait grade.
- Step through each grade left to right against documented criteria.
- Advance one grade only when performance evidence supports the next standard.
- Stop when the evidence no longer supports advancement.

Each marking decision routes through one of three options: Does Not Meet, Meets, or Surpasses. Justifications are entered against synthetic Marines only and are not persisted.

## Synthetic Data Fixture

The application loads a static fixture file containing notional Marines with placeholder identifiers such as Marine Alpha-01, Marine Bravo-02, and so on. The fixture is the only acceptable input source. The fixture file resides at js/syntheticFixture.js and is loaded at startup. Any code path that ingests user-entered names is a defect to be filed and remediated.
