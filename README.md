# CityGovTrainer

An educational aid for people preparing to work in city and county management. The
core feature is a quiz engine that drills the user on real case studies, decision
scenarios, and forward-looking projections that affect a city's operations.

## Why this exists

Local government management is unusually broad — a single manager may touch budgeting,
labor relations, land use, emergency services, and council politics in the same week.
Textbook knowledge alone doesn't prepare you for the *judgment* calls. This tool turns
documented cases and open municipal data into practice questions with explanations.

## Repository layout

```
CityGovTrainer/
├── README.md
├── index.html                 # Site root: redirects to app/ on GitHub Pages
├── .nojekyll                  # Serve files verbatim on GitHub Pages
├── taxonomy/
│   ├── competencies.json      # Topic taxonomy used to tag every question
│   └── community-types.json   # What kind of place a scenario is set in
├── case-studies/
│   ├── TEMPLATE.md            # Structure for authoring a new case
│   └── *.md                   # One file per case study
├── quiz-data/
│   ├── schema.json            # JSON Schema for question objects
│   ├── manifest.json          # What the app loads — add new question files here
│   ├── questions.*.json       # Question banks, loaded in manifest order
│   └── seeds.json             # Agreed scenario backlog, not yet written
├── scripts/
│   └── validate_questions.py  # Schema + taxonomy check; exits non-zero for CI
├── data-sources/
│   └── SOURCES.md             # Vetted external sources + licensing notes
├── app/                       # The quiz runner (static, no build step)
│   ├── index.html
│   ├── styles.css
│   └── js/
└── docs/
    ├── AUTHORING.md           # How to write a good scenario question
    └── ROADMAP.md             # Suggested build order
```

## Content model in one paragraph

A **case study** is a narrative with a decision point. One case seeds several
**questions**. Every question carries one or more **competency tags** from the
taxonomy, a difficulty level, and — critically — an `explanation` field, because in
this domain the reasoning matters more than the answer key.

## Running the app

Locally, from the repository root:

```sh
python3 -m http.server 8000
# open http://localhost:8000/app/
```

Any static server works — the runner is plain HTML, CSS, and ES modules with no build
step and no dependencies. It reads JSON over `fetch`, so it needs HTTP rather than
`file://`. Serve the repository root, not `app/`: the app loads content from the
sibling directories above it. See `app/README.md` for what it does and how to point
it at new content.

### On GitHub Pages

Settings → Pages → **Deploy from a branch**, branch `main`, folder `/ (root)`. No
workflow file and no build are needed. The site root redirects into the app, so both
of these work:

```
https://abcdesi327.github.io/CityGovTrainer/        # redirects to /app/
https://abcdesi327.github.io/CityGovTrainer/app/    # the app itself
```

Two files exist only to make that work, and both should stay:

- **`index.html`** at the repository root redirects to `app/`. The app cannot simply
  live at the root, because it loads content from `taxonomy/`, `quiz-data/`, and
  `case-studies/` — those have to be the root's siblings. Without this redirect the
  published site 404s at `/`, which is where the "Visit site" button lands.
- **`.nojekyll`** stops Pages from running the site through Jekyll, which converts
  Markdown carrying YAML front matter into HTML. That would take `case-studies/*.md`
  out from under the case-study panel, which fetches those files at their real paths
  at runtime.

If you point Pages at a topic branch to preview it, remember to set the source back
to `main` after merging — Pages keeps serving whatever branch it is configured for,
and deleting that branch takes the site down.

## Validating content

```sh
python3 scripts/validate_questions.py          # all quiz-data/questions*.json
```

Checks every question against `quiz-data/schema.json` and `taxonomy/competencies.json`
— unknown competency tags, duplicate ids, missing option rationales, numeric answers
with no stated band, dangling `case_study` links, case studies that list questions
which do not exist, and question files that exist but are missing from
`quiz-data/manifest.json` (which look fine in the repository and are invisible in the
browser). Exits non-zero on error, so it drops straight into CI. Warnings
describe the authoring bar in `docs/AUTHORING.md` and do not fail the run.

## Status

The quiz runner (roadmap Phase 2) is built. The bank holds 36 questions across six
question types and nine kinds of community, covering all ten competencies, plus three
case studies. Content is still the bottleneck: `quiz-data/seeds.json` tracks agreed
scenarios that are not yet written.

## Licensing note

Source material from ICMA, NASPAA, and academic publishers is copyrighted. Cases in
this repo must be **originally written summaries and adaptations**, not reproductions.
See `data-sources/SOURCES.md`.
