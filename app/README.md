# Quiz runner

The Phase 2 runner from `docs/ROADMAP.md`: load JSON, present a question, score it,
show the explanation. No accounts, no persistence, no CMS.

## Running it

The app reads JSON over `fetch`, which browsers block on `file://`. Serve the
repository root over HTTP:

```sh
cd CityGovTrainer
python3 -m http.server 8000
# open http://localhost:8000/app/
```

Any static server works. There is no build step, no package manager, and no
dependency — plain HTML, CSS, and ES modules.

## What it does

- **Session setup** — filter by competency and difficulty, pick a length, shuffle or
  go in difficulty order. Chip counts show how much content each competency actually
  has; a dashed, dimmed chip is a taxonomy entry with nothing written for it yet.
- **All five question types** in `quiz-data/schema.json`: multiple-choice,
  multi-select, ordering (move items up and down), numeric (graded against
  `answer_tolerance`), and open-response.
- **Open-response is self-assessed.** There is no answer key, so the app shows the
  model reasoning and asks the user to rate their own answer. Those questions are
  tallied separately and never fold into the machine score.
- **Feedback per option.** After answering, every option's `rationale` is shown, the
  answer is marked, and the `explanation` follows. Questions tagged
  `defensible-alternatives-exist` say so.
- **Case studies** open in a side panel, rendered from the Markdown source.
- **Scoring by competency** at the end — weakest first — plus a by-difficulty
  breakdown, a per-question review, and "retry the ones I missed".

## Files

| File | Role |
| --- | --- |
| `index.html` | Markup for all three views and the case-study drawer |
| `styles.css` | Single stylesheet; light and dark via `prefers-color-scheme` |
| `js/config.js` | **Where content is loaded from** — the only file to edit when data moves |
| `js/data.js` | Loading, structural checks, filtering |
| `js/grading.js` | Per-type grading, kept free of DOM code so it is testable |
| `js/session.js` | In-memory session state and scoring |
| `js/ui.js` | Rendering: inputs, feedback, results |
| `js/markdown.js` | Small Markdown subset renderer for case-study files |
| `js/main.js` | Wiring, keyboard handling, view switching |

## Adding content

Drop a new question file next to `questions.sample.json` and add it to
`questionFiles` in `js/config.js`. Files are concatenated, so questions can be split
by competency or by author.

`js/data.js` runs a light structural check on load — missing explanations, unknown
competency tags, duplicate ids, malformed answers. Problems appear under the setup
form and in the browser console; a question that cannot be presented or graded is
skipped rather than shown broken. This is a convenience for authors, not a substitute
for the schema check that belongs in CI (roadmap Phase 0) — `quiz-data/schema.json`
remains the authority.

## Keyboard

| Key | Action |
| --- | --- |
| `1`–`9` | Select an option (toggles, for multi-select) |
| `Enter` | Submit, then advance |
| `Esc` | Close the case-study panel |

## Deliberately not here

Accounts, saved progress, an authoring UI, and LLM grading of open responses. Each
one is a roadmap phase or an explicitly rejected direction; the runner stays small so
the content stays the bottleneck.
