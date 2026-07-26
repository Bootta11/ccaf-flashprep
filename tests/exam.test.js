import test from 'node:test';
import assert from 'node:assert/strict';
import { buildExam, DOMAINS, EXAM, QUESTION_POOL } from '../src/data/exam.js';

test('the pool holds exactly one full exam worth of questions', () => {
  assert.equal(QUESTION_POOL.length, EXAM.questionCount);
});

test('every question has 4 options and exactly one valid correct index', () => {
  for (const q of QUESTION_POOL) {
    assert.equal(q.options.length, 4, `question ${q.id} should have 4 options`);
    assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, `question ${q.id} has a bad answer index`);
    assert.equal(new Set(q.options).size, 4, `question ${q.id} has duplicate options`);
    assert.ok(q.q?.trim().length > 0, `question ${q.id} has no prompt`);
    assert.ok(q.explain?.trim().length > 0, `question ${q.id} has no explanation`);
    assert.ok(DOMAINS[q.domain], `question ${q.id} has an unknown domain: ${q.domain}`);
  }
});

test('question prompts are unique', () => {
  const seen = new Set(QUESTION_POOL.map((q) => q.q.trim().toLowerCase()));
  assert.equal(seen.size, QUESTION_POOL.length, 'found duplicate question prompts');
});

test('the exam is 120 minutes and 60 questions', () => {
  assert.equal(EXAM.durationMinutes, 120);
  assert.equal(EXAM.questionCount, 60);
});

test('domain weights sum to 100%', () => {
  const total = Object.values(DOMAINS).reduce((sum, d) => sum + d.weight, 0);
  assert.ok(Math.abs(total - 1) < 1e-9, `weights sum to ${total}`);
});

test('pool distribution matches the blueprint weights', () => {
  for (const [id, meta] of Object.entries(DOMAINS)) {
    const count = QUESTION_POOL.filter((q) => q.domain === id).length;
    assert.equal(count, Math.round(EXAM.questionCount * meta.weight), `domain ${id} count`);
  }
});

test('buildExam returns a full-length exam with answers tracking the shuffle', () => {
  for (let attempt = 0; attempt < 25; attempt++) {
    const exam = buildExam();
    assert.equal(exam.length, EXAM.questionCount);
    assert.equal(new Set(exam.map((q) => q.id)).size, EXAM.questionCount, 'no duplicate questions');

    for (const q of exam) {
      const source = QUESTION_POOL.find((p) => p.id === q.id);
      assert.equal(q.options.length, 4);
      // The shuffled answerIndex must still point at the original correct text.
      assert.equal(q.options[q.answerIndex], source.options[source.a], `question ${q.id} answer drifted`);
      assert.deepEqual([...q.options].sort(), [...source.options].sort(), 'options must be a permutation');
    }
  }
});

test('option shuffling actually varies the correct index across attempts', () => {
  const indices = new Set();
  for (let i = 0; i < 40; i++) {
    for (const q of buildExam()) indices.add(q.answerIndex);
  }
  assert.deepEqual([...indices].sort(), [0, 1, 2, 3]);
});

test('unshuffled builds are stable and keep the original answer index', () => {
  const exam = buildExam({ shuffleQuestions: false, shuffleOptions: false });
  assert.equal(exam.length, EXAM.questionCount);
  for (const q of exam) assert.equal(q.answerIndex, q.a);
});
