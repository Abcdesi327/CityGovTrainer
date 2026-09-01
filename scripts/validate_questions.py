"""Validate CityGovTrainer question files.

Usage:
    python3 scripts/validate_questions.py                  # every quiz-data/questions*.json
    python3 scripts/validate_questions.py path/to/file.json

Run from the repository root. Exits non-zero on any error, so it drops straight
into CI. Warnings describe the authoring bar in docs/AUTHORING.md and do not
fail the run.

The allowed fields, question types, and source tiers are read from
quiz-data/schema.json rather than restated here — a validator with its own copy
of the schema goes stale the first time the schema changes.
"""
import glob
import json
import os
import re
import sys
from collections import Counter

REQUIRED = {"id", "type", "competencies", "difficulty", "prompt", "explanation"}
SLUG = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
OPTION_TYPES = ("multiple-choice", "multi-select", "ordering")

schema = json.load(open("quiz-data/schema.json"))
ALLOWED = set(schema["properties"])
TYPES = set(schema["properties"]["type"]["enum"])
TIERS = set(schema["properties"]["source_tier"]["enum"])

tax = json.load(open("taxonomy/competencies.json"))
valid = set()
for c in tax["competencies"]:
    valid.add(c["id"])
    for s in c.get("subtopics", []):
        valid.add(f'{c["id"]}/{s}')

paths = sys.argv[1:] or sorted(glob.glob("quiz-data/questions*.json"))
if not paths:
    sys.exit("no question files found")

errs, warns, ids, questions = [], [], {}, []

for path in paths:
    for q in json.load(open(path)):
        qid = q.get("id", "<missing id>")
        where = f"{os.path.basename(path)}:{qid}"
        questions.append(q)

        missing = REQUIRED - set(q)
        if missing:
            errs.append(f"{where}: missing required {sorted(missing)}")
        extra = set(q) - ALLOWED
        if extra:
            errs.append(f"{where}: properties not in schema.json {sorted(extra)}")
        if not SLUG.match(qid):
            errs.append(f"{where}: id is not a valid slug")
        if qid in ids:
            errs.append(f"{where}: duplicate id, also in {ids[qid]}")
        ids[qid] = os.path.basename(path)

        if q.get("type") not in TYPES:
            errs.append(f"{where}: bad type {q.get('type')!r}")
        if not isinstance(q.get("difficulty"), int) or not 1 <= q.get("difficulty", 0) <= 3:
            errs.append(f"{where}: difficulty out of range")
        if not q.get("competencies"):
            errs.append(f"{where}: no competencies")
        for c in q.get("competencies", []):
            if c not in valid:
                errs.append(f"{where}: unknown competency {c!r}")

        if "source_tier" not in q:
            warns.append(f"{where}: no source_tier (see docs/AUTHORING.md)")
        elif q["source_tier"] not in TIERS:
            errs.append(f"{where}: unknown source_tier {q['source_tier']!r}")

        t, a = q.get("type"), q.get("answer")

        if t == "multiple-choice" and not isinstance(a, str):
            errs.append(f"{where}: multiple-choice answer must be an option id")
        if t in ("multi-select", "ordering") and not isinstance(a, list):
            errs.append(f"{where}: {t} answer must be an array")
        if t == "open-response" and a is not None:
            errs.append(f"{where}: open-response answer must be null")

        def check_band(spec, label):
            """A numeric answer needs a stated band; exact match is almost never intended."""
            rng = spec.get("answer_range")
            if rng is not None:
                if not isinstance(rng, dict) or not all(
                    isinstance(rng.get(k), (int, float)) for k in ("min", "max")
                ):
                    errs.append(f"{where}: {label} answer_range needs numeric min and max")
                elif rng["min"] > rng["max"]:
                    errs.append(f"{where}: {label} answer_range min is above max")
            elif "answer_tolerance" not in spec:
                errs.append(f"{where}: {label} needs answer_tolerance or answer_range")

        if t == "numeric":
            if not isinstance(a, (int, float)):
                errs.append(f"{where}: numeric answer must be a number")
            check_band(q, "numeric")
            if not q.get("answer_unit"):
                warns.append(f"{where}: numeric without answer_unit")

        if t == "numeric-multi":
            parts = q.get("parts")
            if not isinstance(parts, list) or len(parts) < 2:
                errs.append(f"{where}: numeric-multi needs at least two parts")
            else:
                seen = set()
                for i, p in enumerate(parts):
                    plabel = f"part {p.get('id', i)!r}"
                    if not p.get("id") or not p.get("label"):
                        errs.append(f"{where}: {plabel} needs an id and a label")
                    if p.get("id") in seen:
                        errs.append(f"{where}: duplicate {plabel}")
                    seen.add(p.get("id"))
                    if not isinstance(p.get("answer"), (int, float)):
                        errs.append(f"{where}: {plabel} answer must be a number")
                    check_band(p, plabel)
                    if not p.get("unit"):
                        warns.append(f"{where}: {plabel} without a unit")

        opt_ids = [o.get("id") for o in q.get("options", [])]
        if t in OPTION_TYPES:
            if not opt_ids:
                errs.append(f"{where}: no options")
            if len(set(opt_ids)) != len(opt_ids):
                errs.append(f"{where}: duplicate option ids")
            for o in q.get("options", []):
                if not o.get("rationale"):
                    errs.append(f"{where}: option {o.get('id')!r} has no rationale")
            for x in (a if isinstance(a, list) else [a]):
                if x not in opt_ids:
                    errs.append(f"{where}: answer {x!r} is not an option id")
        if t == "ordering" and isinstance(a, list) and sorted(a) != sorted(opt_ids):
            errs.append(f"{where}: ordering answer must permute every option id")

        cs = q.get("case_study")
        if cs and not os.path.exists(f"case-studies/{cs}"):
            errs.append(f"{where}: case_study file not found: {cs}")

# Cross-check the "Questions seeded from this case" list in each case study against
# the questions that actually exist. Scanning the whole file would also match
# competency tags and filenames, so only that section is read.
seeded = {}
for fn in sorted(os.listdir("case-studies")):
    if not fn.endswith(".md") or fn == "TEMPLATE.md":
        continue
    text = open(f"case-studies/{fn}").read()
    section = re.search(r"##\s*Questions seeded from this case(.*?)(?=\n##\s|\Z)", text, re.S)
    if not section:
        warns.append(f"case-studies/{fn}: no 'Questions seeded from this case' section")
        continue
    for m in re.finditer(r"`([a-z0-9]+(?:-[a-z0-9]+)+)`", section.group(1)):
        slug = m.group(1)
        if slug.endswith("-json") or "/" in slug:
            continue
        seeded[slug] = fn

for slug, fn in sorted(seeded.items()):
    if slug not in ids:
        errs.append(f"case-studies/{fn}: lists question {slug!r}, which does not exist")

for q in questions:
    cs, qid = q.get("case_study"), q.get("id")
    if cs and seeded.get(qid) != cs:
        warns.append(f"{qid}: not listed in case-studies/{cs}")

# The app loads what quiz-data/manifest.json lists. A question file that exists
# but is not listed there is invisible in the browser while looking perfectly
# fine on disk, which is a hard failure to spot from the repository alone.
if os.path.exists("quiz-data/manifest.json"):
    manifest = json.load(open("quiz-data/manifest.json"))
    listed = set(manifest.get("questionFiles", []))
    for f in sorted(listed):
        if not os.path.exists(f):
            errs.append(f"manifest.json lists {f}, which does not exist")
    for f in sorted(glob.glob("quiz-data/questions*.json")):
        if f not in listed:
            errs.append(f"{f} exists but manifest.json does not list it — the app will not load it")
    for key in ("taxonomy", "caseStudyDir"):
        target = manifest.get(key)
        if not target or not os.path.exists(target):
            errs.append(f"manifest.json {key} points at {target!r}, which does not exist")
else:
    warns.append("no quiz-data/manifest.json — the app falls back to its built-in file list")

print(f"{len(questions)} questions across {len(paths)} file(s), {len(ids)} unique ids")
print("types:", dict(Counter(q.get("type") for q in questions)))
print("difficulty:", dict(sorted(Counter(q.get("difficulty") for q in questions).items())))
print("source tiers:", dict(Counter(q.get("source_tier", "(unset)") for q in questions)))
roots = Counter(c.split("/")[0] for q in questions for c in q.get("competencies", []))
print("competency roots:", dict(sorted(roots.items())))
missing_cov = [c["id"] for c in tax["competencies"] if c["id"] not in roots]
if missing_cov:
    print("no questions yet:", ", ".join(missing_cov))

for w in warns:
    print(" ! ", w)
print("ERRORS:" if errs else "\nNo errors.")
for e in errs:
    print(" - ", e)
sys.exit(1 if errs else 0)
