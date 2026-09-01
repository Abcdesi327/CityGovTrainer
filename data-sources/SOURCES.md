# Source Inventory

Grouped by how each source feeds the app. **Read the licensing section first.**

---

## 1. Case study material

| Source | What it gives you | Access |
| --- | --- | --- |
| ICMA, *Managing Local Government: Cases in Effectiveness*, 2nd ed. (Blair & Nelson, eds.) | All-new cases across leadership, ethics, intergovernmental relations, health & safety, finance, community futures, essential services. Each has setting, emerging challenge, and a decision point. Includes discussion questions and memo assignments. | Purchase via icma.org |
| ICMA, *Local Governments Preparing the Next Generation: Successful Case Studies* (28 cases) | Workforce, succession, and talent-pipeline cases. | Free download, icma.org |
| ICMA/NASPAA Local Government Case Studies Project | Teaching-oriented collection; contemporary topics (pandemic response, policing scrutiny, social equity). | icma.org / NASPAA |
| Electronic Hallway (Univ. of Washington Evans School) | Long-running public administration teaching case library. | Institutional subscription |
| Harvard Kennedy School Case Program | Public-sector cases, many local. | Paid, per-case |

## 2. Competency framework (drives `taxonomy/competencies.json`)

- **ICMA Practices for Effective Local Government Leadership** — the competency set
  ICMA members identified as essential to local government management, and the basis of
  ICMA University programming. Use it to structure quiz categories and any
  "readiness by area" scoring. Published as a free PDF on icma.org.
- **NASPAA universal required competencies** — useful cross-check if you want the app
  to map onto MPA coursework.

## 3. Real data for projection-style questions

| Source | Use |
| --- | --- |
| Individual city ACFRs/CAFRs (statistical section) | Assessed value, levy history, fund balance trends, debt ratios. Public documents. Best single source for realistic numbers. |
| U.S. Census — Annual Survey of State & Local Government Finances | Cross-city revenue/expenditure comparisons; benchmark realism. |
| US City Open Data Census (`us-city.census.okfn.org`) | Index of which cities publish budget data openly. Good for finding candidate cities. |
| Municipal open data portals (Socrata/CKAN) | 311 volumes, permits, service requests, response times — raw material for service-level questions. |
| BLS / Census population projections | Demographic-shift scenarios. |
| GFOA best practice library | Authoritative statements on reserves, forecasting, debt policy — good source of defensible "correct" answers. |
| UrbanSim (open source, UC Berkeley Urban Data Science Toolkit) | Land use / transport / density scenario modeling if you ever want questions backed by an actual simulation rather than hand-built numbers. |
| ICMA Open Access Benchmarking | Local government KPI set — useful for performance-management questions. |

## 4. Licensing — read before adding content

The case study collections above are **copyrighted**. Do not copy case text, discussion
questions, or answer keys into this repo, even with attribution, and even into a
private repo — the risk is the same and it forecloses ever making the repo public.

Workable approaches, in order of safety:

1. **Write original composite cases.** Draw the *pattern* from published cases and
   public reporting, invent the specifics. This is what
   `case-studies/fiscal-cliff-after-a-major-employer-leaves.md` does.
2. **Build from primary public documents.** City ACFRs, council agenda packets,
   ordinances, and audit reports are public records. A case built from a real city's
   published budget documents is on solid ground.
3. **Link, don't reproduce.** For copyrighted cases, store only a citation and a URL in
   `further_reading`, and have the app point the user there.

Government works: U.S. federal documents are generally public domain; state and
municipal documents usually are too, but this varies by state — check before assuming.

## 5. Gap worth knowing about

There is no ready-made open question bank for city management. The quiz content will be
originally authored. Plan accordingly: content authoring, not engineering, is the long
pole in this project.
