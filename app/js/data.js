import { CONTENT } from './config.js';

async function fetchJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${path} — HTTP ${res.status}`);
  try {
    return await res.json();
  } catch (err) {
    throw new Error(`${path} — not valid JSON (${err.message})`);
  }
}

const TYPES = new Set([
  'multiple-choice', 'multi-select', 'ordering', 'numeric', 'numeric-multi',
  'open-response',
]);

/**
 * Competency tags may be a root id ("finance") or a subtopic path
 * ("finance/reserves-policy"). Grouping and filtering always happen on the root.
 */
export function rootOf(tag) {
  return String(tag).split('/')[0];
}

/**
 * Light structural check — enough to keep one malformed question from taking the
 * app down, and to surface authoring mistakes the schema would catch in CI.
 * This is deliberately not a full JSON Schema validator; quiz-data/schema.json is the
 * authority and belongs in a CI check (roadmap Phase 0).
 */
function checkQuestion(q, knownCompetencies) {
  const problems = [];
  if (!q || typeof q !== 'object') return ['not an object'];
  if (!q.id) problems.push('missing id');
  if (!TYPES.has(q.type)) problems.push(`unknown type "${q.type}"`);
  if (!q.prompt) problems.push('missing prompt');
  if (!q.explanation) problems.push('missing explanation');
  if (!Array.isArray(q.competencies) || q.competencies.length === 0) {
    problems.push('missing competencies');
  } else {
    for (const tag of q.competencies) {
      if (!knownCompetencies.has(rootOf(tag))) {
        problems.push(`competency "${tag}" is not in the taxonomy`);
      }
    }
  }
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 3) {
    problems.push('difficulty must be 1, 2 or 3');
  }

  const needsOptions = ['multiple-choice', 'multi-select', 'ordering'].includes(q.type);
  if (needsOptions && (!Array.isArray(q.options) || q.options.length < 2)) {
    problems.push(`${q.type} needs at least two options`);
  }
  if (q.type === 'multiple-choice' && typeof q.answer !== 'string') {
    problems.push('multiple-choice answer must be an option id');
  }
  if ((q.type === 'multi-select' || q.type === 'ordering') && !Array.isArray(q.answer)) {
    problems.push(`${q.type} answer must be an array of option ids`);
  }
  if (q.type === 'numeric' && typeof q.answer !== 'number') {
    problems.push('numeric answer must be a number');
  }
  if (q.type === 'numeric-multi') {
    if (!Array.isArray(q.parts) || q.parts.length < 2) {
      problems.push('numeric-multi needs at least two parts');
    } else {
      q.parts.forEach((part, i) => {
        const where = part && part.id ? `part "${part.id}"` : `part #${i + 1}`;
        if (!part || !part.id || !part.label) problems.push(`${where} needs an id and a label`);
        else if (typeof part.answer !== 'number') problems.push(`${where} answer must be a number`);
      });
    }
  }
  return problems;
}

export async function loadContent() {
  const taxonomy = await fetchJSON(CONTENT.taxonomy);

  const competencies = taxonomy.competencies || [];
  const known = new Set(competencies.map((c) => c.id));
  const difficultyLevels = taxonomy.difficulty_levels || [
    { id: 1, label: 'Foundational' },
    { id: 2, label: 'Applied' },
    { id: 3, label: 'Judgment' },
  ];

  const files = await Promise.all(CONTENT.questionFiles.map(fetchJSON));

  const questions = [];
  const warnings = [];
  const seen = new Set();

  files.flat().forEach((q, i) => {
    const problems = checkQuestion(q, known);
    const label = (q && q.id) || `question #${i + 1}`;
    if (q && q.id && seen.has(q.id)) problems.push('duplicate id');
    if (problems.length) {
      warnings.push(`${label}: ${problems.join('; ')}`);
      // A question that can't be presented or graded is skipped rather than
      // shown broken; anything less severe still runs.
      const fatal = problems.some((p) =>
        /unknown type|missing prompt|missing id|needs at least two options|answer must|duplicate id/.test(p));
      if (fatal) return;
    }
    seen.add(q.id);
    questions.push(q);
  });

  const byRoot = new Map(competencies.map((c) => [c.id, c]));

  return { competencies, byRoot, difficultyLevels, questions, warnings };
}

/** Root competency ids a question counts toward, de-duplicated. */
export function questionRoots(q) {
  return [...new Set((q.competencies || []).map(rootOf))];
}

export function filterQuestions(questions, { roots, difficulties }) {
  return questions.filter((q) => {
    if (difficulties.size && !difficulties.has(q.difficulty)) return false;
    if (roots.size && !questionRoots(q).some((r) => roots.has(r))) return false;
    return true;
  });
}

export function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function loadCaseStudy(filename) {
  const res = await fetch(CONTENT.caseStudyDir + filename, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not load ${filename} (HTTP ${res.status})`);
  return res.text();
}
