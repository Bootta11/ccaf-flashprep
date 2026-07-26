import React from 'react';
import { DOMAINS, EXAM, QUESTION_POOL } from '../data/exam.js';

export default function StartScreen({ onStart }) {
  const counts = QUESTION_POOL.reduce((acc, q) => {
    acc[q.domain] = (acc[q.domain] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="screen start">
      <header className="hero">
        <p className="eyebrow">Claude Certified Architect · Foundations</p>
        <h1>CCAF FlashPrep</h1>
        <p className="lede">
          A full-length mock exam: {EXAM.questionCount} scenario questions, four options each,
          one correct answer, {EXAM.durationMinutes} minutes on the clock.
        </p>
      </header>

      <div className="tiles">
        <div className="tile">
          <span className="tile-value">{EXAM.questionCount}</span>
          <span className="tile-label">Questions</span>
        </div>
        <div className="tile">
          <span className="tile-value">{EXAM.durationMinutes}</span>
          <span className="tile-label">Minutes</span>
        </div>
        <div className="tile">
          <span className="tile-value">{Math.round(EXAM.passingScore * 100)}%</span>
          <span className="tile-label">Target score</span>
        </div>
        <div className="tile">
          <span className="tile-value">
            {(((EXAM.durationMinutes * 60) / EXAM.questionCount) | 0)}s
          </span>
          <span className="tile-label">Per question</span>
        </div>
      </div>

      <section className="blueprint">
        <h2>Blueprint coverage</h2>
        <ul className="domain-list">
          {Object.entries(DOMAINS).map(([id, meta]) => (
            <li key={id}>
              <span className="domain-chip" data-domain={id}>
                D{id}
              </span>
              <span className="domain-name">{meta.name}</span>
              <span className="domain-weight">{Math.round(meta.weight * 100)}%</span>
              <span className="domain-count">{counts[id] || 0} q</span>
            </li>
          ))}
        </ul>
      </section>

      <button type="button" className="btn btn-primary btn-lg" onClick={onStart}>
        Start the {EXAM.durationMinutes}-minute exam
      </button>

      <p className="fineprint">
        Questions are drawn to the blueprint weights and both question and option order are
        shuffled each attempt. Your progress is saved in this browser, so a refresh won&apos;t
        lose the clock. Independent study aid — not affiliated with or endorsed by Anthropic.
      </p>
    </main>
  );
}
