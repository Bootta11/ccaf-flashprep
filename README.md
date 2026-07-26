# CCAF FlashPrep

A full-length practice exam for the **Claude Certified Architect – Foundations (CCA-F)** certification: 60 scenario questions, four options each with exactly one correct answer, and a 120-minute clock.

**Live app:** https://bootta11.github.io/ccaf-flashprep/

> Independent study aid. Not affiliated with or endorsed by Anthropic.

## What it does

- **60 questions, 120 minutes.** A wall-clock countdown that survives a page refresh or a backgrounded tab, then auto-submits at zero.
- **Blueprint-weighted.** Questions are drawn to the published CCA-F domain weights.
- **Shuffled every attempt.** Both question order and option order are randomised, so the correct letter is never memorable.
- **Flag and navigate.** A 60-cell grid shows answered / flagged / current at a glance; `←` `→` move between questions and `1`–`4` or `A`–`D` pick an answer.
- **Scored review.** Per-domain breakdown plus a full answer review with explanations, filterable to just the incorrect or unanswered ones.
- **Resumable.** An in-progress attempt is saved to `localStorage`.

## Exam blueprint

| Domain | Weight | Questions |
| --- | --- | --- |
| D1 · Agentic Architecture & Orchestration | 27% | 16 |
| D2 · Tool Design & MCP Integration | 18% | 11 |
| D3 · Claude Code Configuration & Workflows | 20% | 12 |
| D4 · Prompt Engineering & Structured Output | 20% | 12 |
| D5 · Context Management & Reliability | 15% | 9 |

## Question bank

`src/data/` holds the pool, split by provenance:

- **`upstream.js`** — the 15-question mock exam from [jamesbuckett/ccaf-exam-tutorial](https://github.com/jamesbuckett/ccaf-exam-tutorial) (MIT licensed), imported verbatim.
- **`authored.js`** — 45 further questions written for this app, grounded in the same source guide's prose and glossary.
- **`exam.js`** — merges the two, applies the blueprint-weighted draw, and shuffles.

Each question is `{ d, q, options, a, explain }`: `d` is the domain, `options` is exactly four strings, and `a` is the 0-based index of the correct one.

### Adding questions

Append to `authored.js` in the same shape. `npm test` enforces the invariants — four unique options, a valid answer index, a non-empty explanation, no duplicate prompts, and the domain distribution. If you push the pool past 60, `buildExam()` starts sampling and the per-domain counts in `exam.js` become the sampling targets rather than the whole pool.

## Development

```bash
npm install
npm run dev      # local dev server
npm test         # question-bank and exam-builder invariants
npm run lint
npm run build    # production build into dist/
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which lints, tests, builds, and publishes `dist/` to GitHub Pages.

One-time repo setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The Vite `base` is `/ccaf-flashprep/` to match the repo subpath. For a root-domain deploy, build with `BASE_PATH=/`.

## Licence

MIT. Upstream questions are MIT licensed and attributed above.
