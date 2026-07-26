import React, { useMemo, useState } from 'react';
import { DOMAINS, EXAM } from '../data/exam.js';
import { formatDuration } from '../useCountdown.js';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function ResultsScreen({ questions, answers, timeSpentMs, onRestart }) {
  const [filter, setFilter] = useState('all');

  const graded = useMemo(
    () =>
      questions.map((q) => {
        const given = answers[q.id];
        return {
          ...q,
          given,
          answered: given !== undefined,
          correct: given === q.answerIndex,
        };
      }),
    [questions, answers],
  );

  const correctCount = graded.filter((g) => g.correct).length;
  const score = correctCount / questions.length;
  const passed = score >= EXAM.passingScore;

  const byDomain = Object.entries(DOMAINS).map(([id, meta]) => {
    const subset = graded.filter((g) => g.domain === id);
    const right = subset.filter((g) => g.correct).length;
    return { id, meta, total: subset.length, right, pct: subset.length ? right / subset.length : 0 };
  });

  const visible = graded.filter((g) => {
    if (filter === 'incorrect') return !g.correct;
    if (filter === 'unanswered') return !g.answered;
    return true;
  });

  return (
    <main className="screen results">
      <header className={`verdict${passed ? ' is-pass' : ' is-fail'}`}>
        <p className="eyebrow">{passed ? 'Above target' : 'Below target'}</p>
        <h1>
          {correctCount} <span className="dim">/ {questions.length}</span>
        </h1>
        <p className="verdict-pct">{Math.round(score * 100)}%</p>
        <p className="lede">
          Target is {Math.round(EXAM.passingScore * 100)}%. Time used {formatDuration(timeSpentMs)} of{' '}
          {EXAM.durationMinutes}:00 minutes.
        </p>
      </header>

      <section className="breakdown">
        <h2>By domain</h2>
        {byDomain.map(({ id, meta, total, right, pct }) => (
          <div className="bar-row" key={id}>
            <span className="bar-label">
              <span className="domain-chip" data-domain={id}>
                D{id}
              </span>
              {meta.name}
            </span>
            <div className="bar-track">
              <div className="bar-fill" data-domain={id} style={{ width: `${pct * 100}%` }} />
            </div>
            <span className="bar-value">
              {right}/{total}
            </span>
          </div>
        ))}
      </section>

      <section className="review">
        <div className="review-head">
          <h2>Answer review</h2>
          <div className="filters">
            {[
              ['all', `All ${graded.length}`],
              ['incorrect', `Incorrect ${graded.filter((g) => !g.correct).length}`],
              ['unanswered', `Unanswered ${graded.filter((g) => !g.answered).length}`],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`btn btn-ghost${filter === key ? ' is-active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 && <p className="empty">Nothing here — nice.</p>}

        <ol className="review-list">
          {visible.map((g) => (
            <li key={g.id} className={`review-item${g.correct ? ' is-correct' : ' is-wrong'}`}>
              <div className="review-item-head">
                <span className="domain-chip" data-domain={g.domain}>
                  D{g.domain}
                </span>
                <span className={`tag${g.correct ? ' tag-ok' : ' tag-bad'}`}>
                  {g.correct ? 'Correct' : g.answered ? 'Incorrect' : 'Unanswered'}
                </span>
              </div>
              <p className="review-q">{g.q}</p>
              <ul className="review-options">
                {g.options.map((option, i) => {
                  const isAnswer = i === g.answerIndex;
                  const isGiven = i === g.given;
                  return (
                    <li
                      key={i}
                      className={[
                        'review-option',
                        isAnswer ? 'is-answer' : '',
                        isGiven && !isAnswer ? 'is-given-wrong' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <span className="option-letter">{LETTERS[i]}</span>
                      <span className="option-text">{option}</span>
                      {isAnswer && <span className="marker">correct</span>}
                      {isGiven && !isAnswer && <span className="marker">your answer</span>}
                    </li>
                  );
                })}
              </ul>
              <p className="explain">{g.explain}</p>
            </li>
          ))}
        </ol>
      </section>

      <button type="button" className="btn btn-primary btn-lg" onClick={onRestart}>
        Take a fresh attempt
      </button>
    </main>
  );
}
