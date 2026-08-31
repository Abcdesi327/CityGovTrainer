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
├── taxonomy/
│   └── competencies.json      # Topic taxonomy used to tag every question
├── case-studies/
│   ├── TEMPLATE.md            # Structure for authoring a new case
│   └── *.md                   # One file per case study
├── quiz-data/
│   ├── schema.json            # JSON Schema for question objects
│   └── questions.sample.json  # Working examples of each question type
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

```sh
python3 -m http.server 8000
# open http://localhost:8000/app/
```

Any static server works — the runner is plain HTML, CSS, and ES modules with no build
step and no dependencies. It reads JSON over `fetch`, so it needs HTTP rather than
`file://`. See `app/README.md` for what it does and how to point it at new content.

## Status

The quiz runner (roadmap Phase 2) is built and runs against the sample questions. No
question content is finalized; the samples in `quiz-data/` exist to pin down the
schema, and writing real content is the next step.

## Licensing note

Source material from ICMA, NASPAA, and academic publishers is copyrighted. Cases in
this repo must be **originally written summaries and adaptations**, not reproductions.
See `data-sources/SOURCES.md`.
