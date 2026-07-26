import { UPSTREAM } from './upstream.js';
import { AUTHORED } from './authored.js';

/** Exam rules, matching the published CCA-F format. */
export const EXAM = {
  questionCount: 60,
  durationMinutes: 120,
  passingScore: 0.72,
};

/** The five CCA-F domains and their published blueprint weights. */
export const DOMAINS = {
  1: { name: 'Agentic Architecture & Orchestration', weight: 0.27, short: 'D1 · Agentic' },
  2: { name: 'Tool Design & MCP Integration', weight: 0.18, short: 'D2 · Tools & MCP' },
  3: { name: 'Claude Code Configuration & Workflows', weight: 0.2, short: 'D3 · Claude Code' },
  4: { name: 'Prompt Engineering & Structured Output', weight: 0.2, short: 'D4 · Prompting' },
  5: { name: 'Context Management & Reliability', weight: 0.15, short: 'D5 · Context' },
};

/**
 * Full pool: 15 upstream + 45 authored = 60. Each entry gets a stable `id` so
 * answers survive shuffling and can be keyed in state.
 */
export const QUESTION_POOL = [...UPSTREAM, ...AUTHORED].map((q, i) => ({
  ...q,
  id: i,
  domain: q.d,
}));

/** Fisher-Yates, seeded by nothing in particular - a fresh order per attempt. */
function shuffle(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build one exam attempt: `EXAM.questionCount` questions, drawn to match the
 * blueprint weights as closely as the pool allows, with options shuffled so
 * the correct index differs between attempts.
 *
 * The pool is exactly 60, so a full attempt uses every question - the weighted
 * draw matters once the pool grows beyond 60.
 */
export function buildExam({ shuffleQuestions = true, shuffleOptions = true } = {}) {
  const byDomain = {};
  for (const q of QUESTION_POOL) {
    (byDomain[q.domain] ||= []).push(q);
  }

  const picked = [];
  const leftovers = [];

  for (const [domain, meta] of Object.entries(DOMAINS)) {
    const available = shuffleQuestions ? shuffle(byDomain[domain] || []) : [...(byDomain[domain] || [])];
    const target = Math.round(EXAM.questionCount * meta.weight);
    picked.push(...available.slice(0, target));
    leftovers.push(...available.slice(target));
  }

  // Rounding can leave us a question short or long; top up or trim.
  const pool = shuffleQuestions ? shuffle(leftovers) : leftovers;
  while (picked.length < EXAM.questionCount && pool.length) picked.push(pool.shift());
  const sized = picked.slice(0, EXAM.questionCount);

  const ordered = shuffleQuestions ? shuffle(sized) : sized;

  return ordered.map((q) => {
    if (!shuffleOptions) return { ...q, answerIndex: q.a };
    const order = shuffle(q.options.map((_, i) => i));
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answerIndex: order.indexOf(q.a),
    };
  });
}
