import React from 'react';
import { DOMAINS } from '../data/exam.js';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({ question, index, total, selected, onSelect, flagged, onToggleFlag }) {
  const domain = DOMAINS[question.domain];

  return (
    <article className="question-card">
      <div className="question-head">
        <div className="question-meta">
          <span className="question-num">
            Question {index + 1} <span className="dim">/ {total}</span>
          </span>
          <span className="domain-chip" data-domain={question.domain}>
            {domain?.short ?? `D${question.domain}`}
          </span>
        </div>
        <button
          type="button"
          className={`btn btn-ghost${flagged ? ' is-flagged' : ''}`}
          onClick={onToggleFlag}
          aria-pressed={flagged}
        >
          {flagged ? 'Flagged for review' : 'Flag for review'}
        </button>
      </div>

      <h2 className="question-text">{question.q}</h2>

      <ul className="options" role="radiogroup" aria-label={`Question ${index + 1} options`}>
        {question.options.map((option, i) => (
          <li key={i}>
            <button
              type="button"
              role="radio"
              aria-checked={selected === i}
              className={`option${selected === i ? ' is-selected' : ''}`}
              onClick={() => onSelect(i)}
            >
              <span className="option-letter">{LETTERS[i]}</span>
              <span className="option-text">{option}</span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}
