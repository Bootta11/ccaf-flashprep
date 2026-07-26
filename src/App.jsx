import React, { useCallback, useEffect, useMemo, useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import QuestionCard from './components/QuestionCard.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import { buildExam, EXAM } from './data/exam.js';
import { formatDuration, useCountdown } from './useCountdown.js';

const STORAGE_KEY = 'ccaf-flashprep:attempt:v1';
const DURATION_MS = EXAM.durationMinutes * 60 * 1000;

/** Restore an in-progress attempt so a refresh doesn't wipe the clock. */
function loadAttempt() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved?.questions?.length || !saved.deadline) return null;
    if (saved.phase === 'exam' && saved.deadline <= Date.now()) {
      // Clock ran out while the tab was closed - go straight to grading.
      return { ...saved, phase: 'results', timeSpentMs: DURATION_MS };
    }
    return saved;
  } catch {
    return null;
  }
}

export default function App() {
  const [attempt, setAttempt] = useState(loadAttempt);

  const phase = attempt?.phase ?? 'start';
  const questions = attempt?.questions ?? [];
  const answers = attempt?.answers ?? {};
  const flags = attempt?.flags ?? {};
  const [current, setCurrent] = useState(0);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!attempt) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
    } catch {
      // Storage full or blocked (private mode) - the attempt still works in memory.
    }
  }, [attempt]);

  const submit = useCallback(() => {
    setConfirming(false);
    setAttempt((prev) =>
      prev && prev.phase === 'exam'
        ? { ...prev, phase: 'results', timeSpentMs: DURATION_MS - Math.max(0, prev.deadline - Date.now()) }
        : prev,
    );
  }, []);

  const remaining = useCountdown(phase === 'exam' ? attempt.deadline : null, submit);

  const start = () => {
    setCurrent(0);
    setConfirming(false);
    setAttempt({
      phase: 'exam',
      questions: buildExam(),
      answers: {},
      flags: {},
      deadline: Date.now() + DURATION_MS,
    });
  };

  const restart = () => {
    setAttempt(null);
    start();
  };

  const select = (optionIndex) => {
    const { id } = questions[current];
    setAttempt((prev) => ({ ...prev, answers: { ...prev.answers, [id]: optionIndex } }));
  };

  const toggleFlag = () => {
    const { id } = questions[current];
    setAttempt((prev) => {
      const next = { ...prev.flags };
      if (next[id]) delete next[id];
      else next[id] = true;
      return { ...prev, flags: next };
    });
  };

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  // Arrow keys and 1-4 / A-D for keyboard-driven navigation.
  useEffect(() => {
    if (phase !== 'exam') return undefined;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') setCurrent((c) => Math.min(questions.length - 1, c + 1));
      else if (e.key === 'ArrowLeft') setCurrent((c) => Math.max(0, c - 1));
      else {
        const key = e.key.toLowerCase();
        const idx = '1234'.includes(key) ? Number(key) - 1 : 'abcd'.indexOf(key);
        if (idx >= 0 && idx < 4) select(idx);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, current, questions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'start') return <StartScreen onStart={start} />;

  if (phase === 'results') {
    return (
      <ResultsScreen
        questions={questions}
        answers={answers}
        timeSpentMs={attempt.timeSpentMs ?? DURATION_MS}
        onRestart={restart}
      />
    );
  }

  const question = questions[current];
  const lowTime = remaining <= 5 * 60 * 1000;

  return (
    <main className="screen exam">
      <header className="exam-bar">
        <div className="brand">
          <strong>CCAF FlashPrep</strong>
          <span className="dim">CCA-F mock exam</span>
        </div>
        <div className={`timer${lowTime ? ' is-low' : ''}`} role="timer" aria-live="off">
          {formatDuration(remaining)}
        </div>
        <div className="exam-bar-right">
          <span className="progress-text">
            {answeredCount}/{questions.length} answered
          </span>
          <button type="button" className="btn btn-primary" onClick={() => setConfirming(true)}>
            Submit
          </button>
        </div>
      </header>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      <div className="exam-body">
        <QuestionCard
          question={question}
          index={current}
          total={questions.length}
          selected={answers[question.id]}
          onSelect={select}
          flagged={!!flags[question.id]}
          onToggleFlag={toggleFlag}
        />

        <nav className="nav-grid" aria-label="Jump to question">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              aria-label={`Question ${i + 1}`}
              aria-current={i === current}
              className={[
                'nav-cell',
                i === current ? 'is-current' : '',
                answers[q.id] !== undefined ? 'is-answered' : '',
                flags[q.id] ? 'is-flagged' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </nav>
      </div>

      <footer className="exam-foot">
        <button
          type="button"
          className="btn"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          Previous
        </button>
        <span className="hint dim">Keys: ← → to move, 1-4 or A-D to answer</span>
        <button
          type="button"
          className="btn"
          onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
          disabled={current === questions.length - 1}
        >
          Next
        </button>
      </footer>

      {confirming && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm submission">
          <div className="modal">
            <h2>Submit the exam?</h2>
            <p>
              You&apos;ve answered {answeredCount} of {questions.length} questions with{' '}
              {formatDuration(remaining)} left on the clock. Unanswered questions are marked wrong.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setConfirming(false)}>
                Keep working
              </button>
              <button type="button" className="btn btn-primary" onClick={submit}>
                Submit and grade
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
