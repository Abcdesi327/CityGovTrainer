# Source Inventory

Grouped by how each source feeds the app, and tiered by how much yield you get per
hour spent. **Read the licensing section first.**

Working assumption throughout: **link-only citation plus original composites.**
Nothing here is reproduced verbatim into a question stem or a case study. Where a
source is a government work that constraint relaxes — see the licensing table.

---

## Licensing — read before adding content

Most of the case collections below are **copyrighted**. Do not copy case text,
discussion questions, or answer keys into this repo, even with attribution, and even
into a private repo — the risk is the same and it forecloses ever making the repo
public.

Workable approaches, in order of safety:

1. **Write original composite cases.** Draw the *pattern* from published cases and
   public reporting, invent the specifics. This is what
   `case-studies/fiscal-cliff-after-a-major-employer-leaves.md` does.
2. **Build from primary public documents.** City ACFRs, council agenda packets,
   ordinances, audit reports, and bond disclosures are public records. A case built
   from a real city's published documents is on solid ground.
3. **Link, don't reproduce.** For copyrighted cases, store only a citation and a URL
   in `further_reading`, and have the app point the user there.

Government works: U.S. federal documents are generally public domain; state and
municipal documents usually are too, but this varies by state — check before
assuming.

| Source | License | Safe use |
|---|---|---|
| UNC SOG small town cases | Copyrighted, freely readable PDFs | Link-only + original composites |
| GFOA Rethinking reports | Copyrighted, most freely readable | Link-only + original composites |
| Bloomberg Harvard / HKS cases | Copyrighted, free with an account; distribution restrictions on some items | Read for structure; composites only. Do **not** redistribute PDFs |
| City/state performance audits | Government works, effectively public domain | Direct use defensible; composites still preferred for tone consistency |
| ICMA books | Copyrighted, paid | Design reference only |
| ICMA free PDFs (28 Cases, CPM) | Copyrighted, free download | Link-only + original composites |
| Lincoln Institute PDFs | Copyrighted, free download | Link-only + original composites |
| **HUD / HUD Exchange** | **Public domain (federal)** | **Direct use permitted** |
| **EPA / federal reports** | **Public domain** | **Direct use permitted** |
| Federal Reserve Board publications | Public domain | Direct use |
| Reserve Bank publications (Boston, NY, SF, Chicago) | Generally reproducible with attribution; check per item | Direct use with attribution; composites preferred |
| Pew Charitable Trusts | Copyrighted, freely readable | Link-only + original composites |
| Upjohn Institute reports | Copyrighted, freely readable | Link-only + original composites |
| Upjohn Bartik model **outputs** | Your own computation | Direct use |
| NADO Research Foundation | Copyrighted, freely readable | Link-only + original composites |
| HPAIED / Honoring Nations | Copyrighted, freely readable | Link-only + composites; see the cultural caution in that entry |
| Main Street America | Copyrighted; statistics are published figures | Cite figures, paraphrase everything else |
| **UGA Carl Vinson Institute (CVIOG)** | Copyrighted, freely readable; **no Creative Commons grant** | Link-only + original composites; abstract away Georgia-specific mechanisms |
| MRSC | Copyrighted, freely readable | Link-only; abstract away WA statutes |
| Alliance for Innovation | Member-gated | Avoid until access confirmed |
| EMMA filings | Public disclosure documents | Direct use of figures |

Every question records its posture in `source_tier` (`public-domain`, `link-only`,
`design-reference`, `original`), so a change in licensing posture is a query rather
than a re-audit.

---

## Tier 1 — Highest value, use first

### UNC School of Government — Small Town Development Case Studies
`https://www.sog.unc.edu/small-town-development-case-studies-complete`

45 free PDF case studies of small-town economic development, each tagged by
population band (0–999 up to 10,000+) and by strategy: downtown revitalization,
industrial development, business retention and expansion, tourism, entrepreneurship,
broadband, workforce development, ED finance, cluster-based development,
philanthropy, partnership development, smart growth, residential development,
transportation, leadership development. NC-heavy but spans SC, VA, GA, TN, MO, IA,
MN, OH, MD, NE, IN, CA, ND, WV, AR, MS.

Already in case-study form rather than plan form, short and uniform, tagged by
strategy so batch authoring can be stratified by competency, and spread across 45
distinct towns — which is what stops every scenario feeling like the same town.

High-yield picks: Selma NC (downtown revitalization + ED finance), Rio Dell CA and
Ayden NC (downtown revitalization in isolation), Farmville NC (four simultaneous
strategies), Davidson NC (industrial development vs. smart growth), Cape Charles VA
(industrial development in a 1–2K town), Hollandale MS (transportation as the
development lever), Houston MN and Tryon NC (broadband), Ord NE (philanthropy +
leadership development).

Serves: community, IGR, engagement, leadership.

### GFOA — Rethinking Budgeting / Rethinking Revenue
`https://www.gfoa.org/rethinking-budgeting-reports` ·
`https://www.gfoa.org/rethinking-revenue` · `https://www.gfoa.org/research-reports`

GFOA's argument is that incremental line-item budgeting — last year's budget plus
changes at the margins — leaves governments poorly placed under uncertainty. The
library is organized around fairness, decision quality, strategic planning and
reserves, public engagement, politics and conflict, and fragmentation.

Four themes recur across the ~32 public Rethinking Budgeting reports (2020–2024):
public values, behavioral science, coordination, and fiscal prudence. The **decision
architect** framing — the budget officer as the person steering a process toward
shared goals — is a good spine for questions about the manager's role.

Rethinking Revenue adds **over-reliance on fines and fees**, a genuine ethics and
finance crossover: user-pays is defensible in principle and counterproductive when a
jurisdiction leans on it for general fund support.

Also here: the Financial Foundations Framework with practitioner case studies, and
the fund balance guidelines the taxonomy already touches through reserves-policy.
GFOA notes reserve-optimization opportunities beyond that best practice — exactly the
"the textbook answer is not the whole answer" terrain that separates judgment
questions from recall.

Serves: finance, performance, engagement, ethics.

### Bloomberg Harvard City Leadership Initiative — teaching cases
`https://case.hks.harvard.edu/bloomberg-harvard-city-leadership-initiative` ·
`https://content.cityleadership.harvard.edu/resources/collection/data-and-evidence-case-set/` ·
`https://www.cityleadership.harvard.edu/resources/collection/innovation-case-set/` ·
mirrored at `https://www.thecasecentre.org/caseCollection/BloombergCenter`

Free of charge, unusually for Harvard — the materials are deliberately open. Cases
ship with educator guides, practitioner guides, slide decks, epilogues, and videos
for some entries. **The epilogues are the valuable part**: they supply the "what
actually happened" that a decision scenario needs for its `explanation`.

Requires a free HKS Case Program account with Educator Access, roughly two business
days to approve — the only hard external dependency in this list, so start it early.

Relevant sets: **Data and Evidence** (problem diagnosis, where to start on thorny
problems, service delivery, building a data-informed culture, talent pilots) and
**Innovation** (public entrepreneurship, with African, Latin American and Middle
Eastern cases that break the US-centrism of the rest of the bank). Named examples:
Louisville KY, Lansing MI ("Operation Pufferfish").

Serves: performance, leadership, engagement, services.

### Federal Reserve System — community development
Portal across all twelve banks: `https://fedcommunities.org/` · Board publications:
`https://www.federalreserve.gov/consumerscommunities/community-development-publications.htm`

Each Reserve Bank tailors its community development work to its district, which is
what makes the body of work geographically diverse rather than nationally generic.

**The single best artifact is the 2008 concentrated poverty report** (with Brookings,
`http://www.frbsf.org/cpreport/`): sixteen case studies of high-poverty communities —
Albany GA, Atlantic City NJ, Austin TX, Blackfeet Reservation MT, Cleveland OH, El
Paso TX, Fresno CA, Greenville NC, Holmes County MS, Martin County KY, McDowell
County WV, McKinley County NM, Miami FL, Milwaukee WI, Rochester NY, Springfield MA.
That list solves the community-diversity problem in one document: Rust Belt city,
immigrant gateway, resort economy, reservation, Appalachian coal county, Delta
county, Sunbelt boomtown, college town. Each asks the same three questions — what
produced the concentration, what does it create, what local capacity exists to change
it — which gives one analytical spine across very different places. It is dated;
treat it as scenario substrate and refresh figures from ACS.

Also worth mining: **Chicago Fed** on the economics of state-mandated lead service
line replacement, a genuinely underused topic at the community development and public
works intersection; **New York Fed** case studies of multifamily affordable housing
financed without LIHTC (Schenectady, Brooklyn, Jersey City — three market contexts,
one financing question); **San Francisco Fed** *Community Development Investment
Review*; and the Board's *Putting Data to Work* and *REO and Vacant Properties*
volumes.

Serves: community, performance, services, finance.

### Boston Fed — Working Cities / Working Places Challenge
`https://www.bostonfed.org/workingplaces/`

**The best-documented community development intervention available, and it comes with
independent evaluations.** Boston Fed researchers working on Springfield MA between
2008 and 2011 asked whether a city like it was fated to decline; the finding that
recovery correlated with sustained cross-sector collaboration toward a shared
long-term goal became the Working Cities Challenge in 2013.

What makes it usable is unusual: **a defined comparison set** of twenty eligible
Massachusetts cities — same state, same statutory environment, very different
trajectories, which is a clean setup for comparative questions. **Independent
evaluation** by Mt. Auburn Associates of the first round (Chelsea, Holyoke,
Fitchburg, Lawrence), which contains what grantee press releases do not. And **named,
measurable goals**: Chelsea Thrives targeted a 30% crime reduction over ten years;
Middletown CT targeted cutting single-parent families below the federal poverty line
from 35% to 20% over ten years. Concrete enough to build performance-measurement
questions on.

Corroborating work on smaller industrial cities in PA, NJ and DE points the same way,
which lets you write a question whose correct answer is about *governance capacity*
rather than about a program.

Serves: community, leadership, engagement, IGR, performance.

### HUD Exchange — CDBG (public domain)
Project profiles: `https://www.hudexchange.info/programs/cdbg/project-profiles/` ·
CDBG-DR Economic Revitalization Guide:
`https://www.hudexchange.info/programs/cdbg-dr/economic-revitalization-guide/`

**CDBG Project Profiles** is a browsable bank of short writeups selected for being
innovative and replicable — already question-sized. A sanitary sewer project for a
town whose wastewater provider ceased operations, protecting service for 360
residents and 13 businesses, is a complete scenario in one sentence and sits across
community development, public works, IGR and finance at once.

The **CDBG-DR Economic Revitalization Guide** carries named cases — Louisiana small
business lending, Puerto Rico workforce training and tourism marketing, Mississippi's
Jackson County Maritime Training Facility, the Port of Gulfport restoration. This is
**disaster recovery economic development**, a category the bank otherwise lacks.

Also here: Section 108 loan guarantees, state versus entitlement CDBG mechanics, an
Opportunity Zones playbook, and historic tax credit projects. Worth building at least
one question purely on **national objective compliance** — LMI benefit, slum and
blight, urgent need — because it separates people who have administered a grant from
people who have read about one.

*Federal works, public domain. Draw directly.*

Serves: community, finance, IGR, services.

### Economic development incentives — Pew and Upjohn
Pew toolkit: `https://www.pew.org/en/research-and-analysis/data-visualizations/2024/economic-development-incentives-evaluation-toolkit` ·
Upjohn portal: `https://research.upjohn.org/incentives/` ·
Bartik benefit-cost model: `https://research.upjohn.org/reports/287/`

**The richest vein for hard judgment questions in any of these inventories.**

The concept a manager needs and most candidates miss is **additionality** — the share
of incented activity that would not have happened anyway. Bartik has a working paper
on plausible "but for" percentages. Its companion is **displacement**: activity spurred
at the expense of other businesses in the same jurisdiction. Note how cleanly this
rhymes with the Lincoln Institute TIF finding logged above — same structural insight,
different instrument, and a question that makes a candidate recognize the shared logic
across TIF and abatements is a good difficulty-3 question.

Practical hooks: the **Bartik benefit-cost model** ships as an Excel workbook and as
Python that does not require knowing Python — it is a numeric question generator whose
outputs are defensible answer keys, and outputs you compute are your own. The **Panel
Database on Incentives and Taxes** covers 1990–2015, 33 states, 45 industries.
**Realistic Local Job Multipliers** (Bartik and Sotherland) is the antidote to the
inflated multipliers in consultant impact studies presented to councils. The **NCSL
State Tax Incentive Evaluations Database** aggregates 250+ state and city evaluations
of public documents.

Serves: finance, community, ethics, performance.

### NADO — rural and regional development organizations
`https://www.nado.org/awards/` · `https://www.nado.org/wealthworks-case-studies/`

The Impact Award recipient lists are the asset: each entry is an organization plus a
project title, and the titles function as scenario seeds — rural blight code
enforcement, an abandoned carbide plant brownfield, water regionalization, a regional
housing study, county broadband partnerships, telehealth feasibility, site-readiness
tooling, regional NG911. **WealthWorks** case studies apply a rural wealth-creation
frame built on existing assets and local ownership.

Why it matters: the **regional development organization** — council of governments,
planning district, economic development district — is a governance form this taxonomy
touched only through IGR, and for a small-city manager it is often the single most
consequential intergovernmental relationship they have.

Serves: IGR, community, services, finance.

### Harvard Project on American Indian Economic Development / Honoring Nations
`https://hpaied.org/research` · `https://indigenousgov.hks.harvard.edu/honoring-nations`

136+ tribal government programs from 100+ nations recognized since 1998, with case
studies generated from the honoree pool. The **selection criteria are themselves a
good analytic framework** worth borrowing regardless of subject: effectiveness,
significance to sovereignty, cultural relevance, transferability, sustainability —
that last pair being exactly what a manager should ask about any program a peer city
recommends.

**Handle with care.** Tribal governance is a distinct sovereign context, not a variant
of municipal government, and a question treating a tribal nation as "a city with
different rules" would be both wrong and offensive. The defensible use is scenarios
about municipal–tribal intergovernmental relations *from the city manager's side*:
jurisdiction, taxation, service agreements, consultation obligations, cross-boundary
infrastructure. Write from the seat the user occupies. Material here should also get a
read from someone with tribal government experience before it ships.

Serves: IGR, community, ethics.

### Main Street America and the downtown revitalization evidence problem
`https://mainstreet.org/our-network/collective-impact` · critical literature:
`https://andrewvanleuven.com/files/papers/wp_msp2021.pdf`

The headline figures are everywhere — since 1980 the network reports $124.67 billion
reinvested, 188,583 net new businesses, 852,443 net new jobs; 2023 alone reports an
$18-to-$1 reinvestment ratio.

**Build the question around the evidence problem, not the numbers.** Studies of the
program typically rely on data supplied by the participating communities themselves
and cannot be independently verified, and rural data quality is weaker than urban to
begin with. The scenario writes itself: a council member brings the $18:1 ratio to a
budget hearing, and the manager has to respond without either endorsing an unverified
figure or dismissing a program that may well work. That tests analytic honesty,
political judgment, and the ability to say "the evidence is weaker than the number
suggests" without torching a council relationship.

Mine separately: permitting and construction review timelines as a determinant of
whether investment happens locally or moves next door. Slow permitting and mismatched
zoning are the unglamorous half of economic development and are almost never what
candidates reach for first.

Serves: community, performance, ethics, engagement, leadership.

### UGA Carl Vinson Institute of Government (CVIOG)
`https://cviog.uga.edu/resources/index.html`

The Georgia Downtown Renaissance Partnership's **Renaissance Strategic Vision and
Planning (RSVP)** reports are full downtown strategic plans for small Georgia cities,
each following the same three steps: public input for "where are we now", design
renderings for "where are we going", and sequenced action items for "how do we get
there". Action items carry a named lead, named partners, numbered steps, and a
short/medium/long-term timeline.

This is the richest freely-readable material on how small-city redevelopment
decisions actually get sequenced, and **the action-item format is close to an answer
key for questions about implementation order.**

- Augusta (2024) · Baxley (2023) · Buena Vista (2022) · Carrollton (2024) ·
  Homerville (2022) · Lafayette (2022) — `https://issuu.com/rsvpstudio`
- Hawkinsville full report, locally hosted PDF and easier to read programmatically:
  `https://hawkinsvillechamber.org/wp-content/uploads/2020/05/Hawkinsville-RSVP_Full-Report.pdf`

Prefer a locally hosted PDF over the Issuu copies where one exists.

**Compliance Auditing in Georgia Counties and Municipalities** —
`https://cviog.uga.edu/resources/compliance-auditing-publication.html` walks statutory
compliance areas title by title; the closest thing CVIOG publishes to a general
local-government reference. Good for foundational (difficulty 1) questions about who
is required to do what, though the citations are Georgia code.

Structural reference, not question material: the **Certified Public Manager** program
(`https://cviog.uga.edu/training/leadership-development/cpm.html`) is a second
competency framework worth cross-checking `taxonomy/competencies.json` against — its
value is confirming the taxonomy is not missing a whole functional area. The **Public
Finance Leadership Academy** and **Community Planning Program** course sequences are
reasonable proxies for what a practicing finance officer and planner are expected to
know, mapping onto `finance` and `community`.

Data and background: **Georgia County Guide / GeorgiaData.org**
(`https://georgiadata.org/data/data-tables`) publishes county-level demographic and
economic tables — public data, safe to use directly, and good backing for
`data_reference`. The **Georgia Municipal Association** (`gacities.com`) publishes
follow-up coverage on RSVP communities, which is how you find out whether a plan was
actually implemented — **that gap between plan and outcome is the most interesting
question material in the whole set**, and is what
`case-studies/donor-funded-plan-implementation-gap.md` is built on.

Two constraints specific to this source:

- **No open license.** CVIOG publications are freely readable but carry no Creative
  Commons grant. Read as background and write original scenarios; cite by title and
  URL; do not reproduce renderings, tables, action-item pages, or paragraphs.
  Restating factual findings — a vacancy count, a traffic volume — is fine as far as
  copyright goes, but a question built on a named real city's real numbers turns a
  living community into a teaching specimen and dates badly. Change the city, the
  names, and the magnitudes; keep the structure of the problem.
- **Nearly everything is Georgia-specific.** Downtown development authority powers,
  Rural Zone credits, the Georgia Land Bank Act, and millage-rate blight taxes are
  creatures of Georgia law. Treat them as examples of a *category* of tool, not as
  the national baseline. Where a question depends on a Georgia-specific mechanism,
  say so in the `explanation`.

CVIOG publishes no question bank, no teaching case collection, and no assessment
material. Every question in this repo is authored by hand.

Serves: community, engagement, performance, leadership, finance.

### City and state performance audits (government works)
- Oakland — `https://www.oaklandauditor.com` (Public Works Agency: org structure,
  service levels, infrastructure management, staffing, benchmarked against peer
  California cities)
- WA State Auditor — `https://portal.sao.wa.gov/ReportSearch/` (Seattle Public
  Utilities: indirect cost allocation between utility and general government, fire
  hydrant cost responsibility, fleet maintenance, utility tax share of general fund)
- San Francisco Public Works —
  `https://sfpublicworks.org/about/management-and-performance-audits` (municipal
  asphalt plant make-vs-buy; transportation capital plan)
- WA State Auditor Center for Government Innovation —
  `https://sao.wa.gov/about-audits/about-performance-audits`

**This is the answer to public works questions.** Performance audits are already
structured as scenario → finding → recommendation → management response, which maps
almost one-to-one onto the question object: setup, correct answer, distractors from
the rejected options, explanation from the recommendation. They carry real numbers,
real constraints, and real disagreement between auditor and department.

Typical scope — program results, staffing, compensation, contract management,
facility and fleet use — doubles as a checklist for whether a batch spans the domain.

Serves: services, finance, HR, performance.

---

## Tier 2 — Strong, some friction

### ICMA
- ***Managing Local Government: Cases in Effectiveness*, 2nd ed.** (Blair & Nelson,
  eds.) — `https://icma.org/articles/article/managing-local-government-cases-effectiveness-second-edition`
  Twenty-plus new cases, most co-authored by a practitioner and an academic, in seven
  thematic parts including Leadership and Governance, Ethics and Values,
  Intergovernmental Relationships, and Public Health and Safety. Many include the
  tools of the trade — memos, news releases, maps, budget documents, spreadsheets —
  and a cast of actors for role-play, with an instructor's manual carrying the
  aftermath. Structurally the closest published thing to what this repo is building.
  **Paid. Read it for case architecture, not content.**
- **Local Governments Preparing the Next Generation: 28 Case Studies** (Cal-ICMA
  Coaching Program) — free download. HR, succession, talent pipeline.
- **Center for Performance Measurement case study reports** —
  `https://icma.org/case-study-reports` Short comparisons: fire minimum staffing vs.
  outcomes, highway service levels vs. citizen satisfaction, HR leave banks, parks
  facility availability. Each is close to a ready-made numeric or multi-select item.
- **What Works** — 70+ short performance management cases across 16 service areas.
- **Growing Local Food Systems** case series (with MSU) — niche, free.

Serves: all ten competencies, especially ethics, IGR, safety, HR.

### Lincoln Institute of Land Policy
`https://www.lincolninst.edu/publications/policy-focus-reports/improving-tax-increment-financing-tif-economic-development/`

The Merriman TIF policy focus report is the best single artifact: how districts work,
case studies from around the country, and the pitfalls alongside the benefits. The
empirical finding worth building a question on — in Illinois data, non-TIF areas of
TIF-using municipalities grew no faster (possibly slower) than comparable non-TIF
municipalities, and commercial TIF districts appear to depress commercial value
growth elsewhere in the same municipality while industrial districts show no such
offset.

That asymmetry is a genuinely hard question. Most candidates treat TIF as uniformly
good or uniformly suspect; the land-use-dependent answer separates them.

Also useful: *Municipal Revenues and Land Policies* (intergovernmental transfers,
property tax, local option taxes, BIDs, impact fees, debt financing, P3s) and the
free online course *Foundations of Local Government Finance in the United States*.

Serves: finance, community, IGR.

### EPA Smart Growth & Brownfields (public domain)
`https://www.epa.gov/smartgrowth/smart-growth-publications` ·
`https://www.epa.gov/smartgrowth/smart-growth-and-infill-brownfields-redevelopment` ·
`https://www.epa.gov/brownfields/navigating-funding-brownfields-revitalization`

Technical assistance reports from real engagements with real cities, across
brownfields and infill, economic development, climate and energy, disaster
resilience, development codes, regional planning, rural smart growth, school siting,
transportation, and green infrastructure.

Worth reading: **Saginaw MI (2014)**, land use and infrastructure strategy for vacant
and abandoned property — a *shrinking city* case, a frame this bank lacks entirely;
**Zuni Pueblo (2013)**, petroleum brownfield redevelopment in a tribal IGR context;
**Plan El Paso (2011)**, a 600-acre industrial brownfield anchoring three TOD
neighborhoods; **Wellington Neighborhood, Breckenridge CO**, dredge-mined site to
mixed affordable and market housing; **City Green (2016)**, green infrastructure
downtown.

The brownfields funding guidance is a clean CIP and finance topic in its own right:
state grants and tax credits, philanthropy, private capital, and the "break projects
into smaller fundable parts" approach.

**Federal works are public domain**, so this material can be drawn on directly.
Archived snapshots (`19january2017snapshot.epa.gov`, `19january2021snapshot.epa.gov`)
hold older material that has since moved.

Serves: community, services, IGR.

### MRSC — Municipal Research and Services Center (Washington)
`https://mrsc.org/explore-topics/public-works/` ·
`https://mrsc.org/explore-topics/utilities/water-sewer/`

A nonprofit serving WA local governments, with granular free guidance and a sample
document library (resolutions, policies, job descriptions, rate schedules). Much of
the utility billing series was built with the State Auditor's Center for Government
Innovation.

Good scenario substrate: utility billing procedures (deposits, combined accounts,
leak adjustments); delinquent account collection and statutory interest ceilings;
low-income and disability discounts; utility charges at property transfer; internal
controls for utility finances; utility and B&O tax on municipally owned utilities and
the general-fund dependency it creates; small works rosters and procurement
thresholds.

Caveat: **WA-specific statutory detail (RCW citations).** Do not port the numbers
into a generic-city composite — that produces subtly wrong questions. Either set the
scenario explicitly in a WA-like state and flag it, or abstract to the structural
dilemma and drop the citations. The *shape* generalizes; the thresholds don't.

Serves: services, finance.

---

## Tier 3 — Situational

- **Electronic Hallway** (Univ. of Washington Evans School) — long-running public
  administration teaching case library. Institutional subscription.
- **Alliance for Innovation** — `https://www.transformgov.org/` Case studies and
  Innovation Award writeups from the Transforming Local Government conference. Mostly
  member-gated; a free subscriber tier reportedly reaches news, case studies, and
  presentations. Check what is actually behind the wall before spending anything.
- **ICMA/NASPAA Local Government Case Studies Project** —
  `https://www.unomaha.edu/college-of-public-affairs-and-community-service/public-administration/engagement/rfp-icma-naspaa-case-studies.php`
  An open RFP for new cases. Watch for the resulting collection; authoring a case for
  it is also a plausible credibility path for this project.
- **Governing / Route Fifty** — `https://www.governing.com/` Trade press, copyrighted.
  Useful for spotting which audits and disputes are worth chasing to primary
  documents, not for content.

---

## Competency framework

Drives `taxonomy/competencies.json`.

- **ICMA Practices for Effective Local Government Leadership** — the competency set
  ICMA members identified as essential to local government management, and the basis
  of ICMA University programming. Use it to structure quiz categories and any
  "readiness by area" scoring. Free PDF on icma.org.
- **NASPAA universal required competencies** — a cross-check if the app should map
  onto MPA coursework.

---

## Real numbers for numeric and projection questions

| Source | Use |
| --- | --- |
| **EMMA** (`emma.msrb.org`) official statements and continuing disclosure | Multi-year fund balance history, debt service schedules, pension and OPEB liabilities, explicit risk factor sections. All public, all real. The richest substrate for `numeric` and `numeric-multi` items, currently the thinnest categories in the bank. |
| Individual city ACFRs/CAFRs (statistical section) | Assessed value, levy history, fund balance trends, debt ratios. Best single source for realistic figures. |
| U.S. Census — Annual Survey of State & Local Government Finances | Cross-city revenue and expenditure comparisons; benchmark realism. |
| US City Open Data Census (`us-city.census.okfn.org`) | Index of which cities publish budget data openly. Good for finding candidate cities. |
| Municipal open data portals (Socrata/CKAN) | 311 volumes, permits, service requests, response times — raw material for service-level questions. |
| BLS / Census population projections | Demographic-shift scenarios. |
| GFOA best practice library | Authoritative statements on reserves, forecasting, debt policy — a good source of defensible correct answers. |
| ICMA Open Access Benchmarking | Local government KPI set, for performance-management questions. |
| UrbanSim (UC Berkeley Urban Data Science Toolkit) | Land use and transport scenario modeling, if questions should ever be backed by a simulation rather than hand-built numbers. |

---

## Community typology

Topic is not the only axis that matters: a downtown vacancy problem in a legacy
industrial city and the same problem in a high-growth exurb are different questions
with different right answers. `taxonomy/community-types.json` holds the thirteen
types, every question carries a `community_type`, and the results screen scores by
it — a learner can see which kinds of place they have never practised, not just which
topics.

Twelve types come from the third-wave source review. The thirteenth,
`small-town-county-seat`, was added here because that matrix had no slot for the
setting most common in this bank already.

Four types still have no questions: `immigrant-gateway`, `resort-seasonal`,
`resource-dependent`, and `tribal-adjacent`. The first three are ordinary gaps. The
fourth is deliberate — see the HPAIED entry above.

## Gap worth knowing about

There is still no ready-made open question bank for city management. The quiz content
will be originally authored. Content authoring, not engineering, is the long pole.

## Sequencing

1. **Register for HKS Case Program educator access now** — the approval delay is the
   only hard external dependency here.
2. **The schema question is settled.** `numeric` carries `answer_unit` and either
   `answer_tolerance` or an explicit `answer_range`; `numeric-multi` expresses a
   decomposition as independently graded `parts`. Seeds B4 and P2 drove this.
3. **Pull the UNC SOG PDFs as a batch** — 45 files, uniform format. Worth mirroring
   locally with a manifest; they are the backbone of the community expansion.
4. **Start with EPA material for the first new batch.** Public domain means the
   composite-authoring pipeline can be validated without the licensing question
   sitting on top of it.
5. **`source_tier` is live on every question** — see the licensing table above.

The agreed scenario seeds are tracked in `quiz-data/seeds.json`.
