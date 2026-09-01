# Suggested Build Order

Content is the bottleneck, not code. This order front-loads decisions that are
expensive to reverse.

## Phase 0 — Lock the data model (you are here)

Finalize `taxonomy/competencies.json` and `quiz-data/schema.json` before writing bulk
content. Renaming a competency ID after 200 questions exist means a migration.

Add a CI check that validates every question file against the schema and rejects
unknown competency tags. The validation snippet in this repo's history is a starting
point.

## Phase 1 — Twenty questions, one competency

Pick the area you know best (finance is a good candidate — it has objective anchors)
and write twenty questions across all three difficulty levels plus one full case study.
Twenty is enough to find out whether your schema is missing a field, and small enough
to throw away.

## Phase 2 — Minimal quiz runner

Load JSON, present a question, score, show the explanation. No accounts, no
persistence beyond a session. Resist building a CMS.

## Phase 3 — Broaden content

Expand to all ten competencies. Target coverage rather than volume: five to ten solid
questions per competency beats fifty in one area.

## Phase 4 — Progress and weakness tracking

Score by competency so the user sees where they're thin. This is where the taxonomy
pays off, and why Phase 0 matters.

## Phase 5 — Projection questions with live data

Wire in real municipal open data so some questions pull current figures rather than
hardcoded ones. Highest effort, highest differentiation — save it for last.

## Things to decide before Phase 2

- **Storage**: flat JSON in the repo is fine well past a thousand questions and keeps
  content reviewable in pull requests. Don't reach for a database early.
- **Open-response grading**: options are self-assessment against the model answer, or
  an LLM call. Self-assessment ships faster and is honest about its limits.
- **Public or private repo**: this determines how careful you must be about source
  material. See `data-sources/SOURCES.md`.
