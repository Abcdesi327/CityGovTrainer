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

For numeric questions always set `answer_tolerance`. Forecasting questions should
reward the right method, not arithmetic precision.

## Checklist before committing a question

- [ ] `id` is a stable slug and unique
- [ ] Competency tags exist in `taxonomy/competencies.json`
- [ ] Every option has a `rationale`
- [ ] `explanation` states the teaching point and the tradeoff
- [ ] No copyrighted text pasted from any source
- [ ] Numbers are plausible for the stated city size
- [ ] `further_reading` points to something the user can actually reach
