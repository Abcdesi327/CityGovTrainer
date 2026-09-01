# Authoring Guide

## The bar

A good question here tests judgment under constraints, not recall of a definition.
Foundational (difficulty 1) questions exist to establish vocabulary — keep them few.
Most of the value is at difficulty 2 and 3.

## Rules that keep quality up

**Every distractor must be plausible to someone who half-knows the material.** If the
wrong answers are obviously wrong, the question tests reading speed. Give each option a
`rationale` — writing them will expose weak distractors.

**Write the explanation first.** If you can't articulate the teaching point in three
sentences, the question isn't ready. The `explanation` field is required for exactly
this reason.

**Name the tradeoff.** Local government decisions rarely have a costless right answer.
Good explanations say what the correct choice gives up, not just why it wins.

**Don't smuggle a political position into an answer key.** Questions about housing
policy, policing, or land use should test process, legal constraints, fiscal
consequences, and the manager's role — not which policy outcome is preferable. Where
reasonable practitioners disagree, use `open-response` and say so in the explanation.

**Flag heuristics as heuristics.** Tag questions where defensible alternatives exist
with `"tags": ["defensible-alternatives-exist"]` so the app can present them
accordingly.

**Keep scenarios under ~200 words.** Longer belongs in a case study file, with the
question referencing it via `case_study`.

## Numbers

Use real municipal figures where you can (ACFRs are public). If you invent numbers,
sanity-check them against a real city of similar size — a $42M general fund for a city
of 38,000 is roughly right; $420M is not, and a reader who works in local government
will notice.

For numeric questions always set `answer_unit` and a band — either
`answer_tolerance` (symmetric) or `answer_range` (an explicit min and max, for when
the defensible spread is lopsided: under-forecasting revenue is not the same mistake
as over-forecasting it). Forecasting questions should reward the right method, not
arithmetic precision. A missing unit invites unit-mismatch answers that look like
reasoning errors and grade like them.

When the teaching point is *decomposing* a figure rather than producing one, use
`numeric-multi` and give each figure its own `parts` entry with a label, a band, a
unit, and a `rationale`. Each part is graded independently and the feedback says
which figure went wrong, so a candidate who splits structural from one-time correctly
but fumbles the recurring correction can see exactly that.

## Where the scenario is set

Set `community_type` on every question that has a scenario, using an id from
`taxonomy/community-types.json`. Omit it only when the question is genuinely
place-independent — a definition, or arithmetic that would read the same anywhere.

This is a second axis, orthogonal to competency, and it exists because the same topic
has different right answers in different places. Downtown vacancy in a legacy
industrial city is a capacity problem; in a high-growth exurb it is a market-timing
problem. A candidate trained only on one carries a single implicit model of "a city"
into a career that may not match it.

Spread each batch across the axis the way you already spread it across question type.
`scripts/validate_questions.py` prints the distribution and names the types with no
questions yet.

## Provenance

Set `source_tier` on every question to the licensing posture of whatever it is
grounded in:

| Value | Means | Consequence |
| --- | --- | --- |
| `public-domain` | Federal, state or municipal government work | Figures and findings may be used directly |
| `link-only` | Copyrighted but readable | Original composite, cited by URL, nothing reproduced |
| `design-reference` | Paid or gated, read for case architecture | No content drawn from it at all |
| `original` | Invented, no external grounding | Sanity-check the numbers against a real city |

This exists so that a change in licensing posture is a query rather than a re-audit.
`data-sources/SOURCES.md` records which tier each source falls in.

## Checklist before committing a question

- [ ] `id` is a stable slug and unique
- [ ] `community_type` is set, or the question is genuinely place-independent
- [ ] `source_tier` is set, and matches what `data-sources/SOURCES.md` says
- [ ] Competency tags exist in `taxonomy/competencies.json`
- [ ] Every option has a `rationale`
- [ ] `explanation` states the teaching point and the tradeoff
- [ ] No copyrighted text pasted from any source
- [ ] Numbers are plausible for the stated city size, and carry a unit and a band
- [ ] `further_reading` points to something the user can actually reach
