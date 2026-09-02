import { grade } from './grading.js';
import { questionRoots } from './data.js';

/**
 * A session is in-memory only. Nothing is persisted — no accounts, no storage
 * (roadmap Phase 2). Closing the tab ends the session, on purpose.
 */
export function createSession(questions) {
  return {
    questions,
    index: 0,
    /** id -> { response, result, selfAssess } */
    records: new Map(),
  };
}

export const current = (s) => s.questions[s.index];
export const isLast = (s) => s.index >= s.questions.length - 1;

export function submit(session, response) {
  const q = current(session);
  const result = grade(q, response);
  session.records.set(q.id, { response, result, selfAssess: null });
  return result;
}

export function setSelfAssessment(session, value) {
  const rec = session.records.get(current(session).id);
  if (rec) rec.selfAssess = value;
}

export function advance(session) {
  session.index += 1;
}

/** Rebuild a session from the questions the user got wrong (or self-marked as missed). */
export function missedQuestions(session) {
  return session.questions.filter((q) => {
    const rec = session.records.get(q.id);
    if (!rec) return false;
    if (rec.result.status === 'incorrect') return true;
    return rec.result.status === 'ungraded' && rec.selfAssess === 'missed';
  });
}

/**
 * Score by competency — the reason the taxonomy exists. Open-response questions
 * are tallied separately from graded ones so a self-assessment never inflates a
 * machine score.
 */
export function summarize(session) {
  const totals = { correct: 0, incorrect: 0, graded: 0, ungraded: 0 };
  const byCompetency = new Map();
  const byDifficulty = new Map();
  const byCommunityType = new Map();

  const bump = (map, key, status) => {
    if (!map.has(key)) {
      map.set(key, { correct: 0, incorrect: 0, graded: 0, ungraded: 0 });
    }
    const bucket = map.get(key);
    if (status === 'ungraded') bucket.ungraded += 1;
    else {
      bucket.graded += 1;
      bucket[status] += 1;
    }
  };

  for (const q of session.questions) {
    const rec = session.records.get(q.id);
    if (!rec) continue;
    const { status } = rec.result;

    if (status === 'ungraded') totals.ungraded += 1;
    else {
      totals.graded += 1;
      totals[status] += 1;
    }

    for (const root of questionRoots(q)) bump(byCompetency, root, status);
    bump(byDifficulty, q.difficulty, status);
    if (q.community_type) bump(byCommunityType, q.community_type, status);
  }

  const selfAssessed = { covered: 0, partial: 0, missed: 0, unrated: 0 };
  for (const q of session.questions) {
    const rec = session.records.get(q.id);
    if (!rec || rec.result.status !== 'ungraded') continue;
    selfAssessed[rec.selfAssess || 'unrated'] += 1;
  }

  return { totals, byCompetency, byDifficulty, byCommunityType, selfAssessed };
}
