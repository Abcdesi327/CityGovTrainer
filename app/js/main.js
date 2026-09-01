import { LENGTHS } from './config.js';
import {
  loadContent, filterQuestions, shuffle, questionRoots, loadCaseStudy,
} from './data.js';
import { hasResponse } from './grading.js';
import {
  createSession, current, isLast, submit, advance, setSelfAssessment,
  summarize, missedQuestions,
} from './session.js';
import {
  el, clear, renderAnswerArea, renderFeedback, renderResults,
  competencyLabels, DIFFICULTY_LABEL,
} from './ui.js';
import { renderMarkdown, splitFrontMatter, extractTitle } from './markdown.js';

const $ = (id) => document.getElementById(id);

const views = {
  loading: $('view-loading'),
  error: $('view-error'),
  setup: $('view-setup'),
  quiz: $('view-quiz'),
  results: $('view-results'),
};

const state = {
  content: null,
  filters: { roots: new Set(), difficulties: new Set([1, 2, 3]), length: 10, shuffle: true },
  session: null,
  answerControl: null,
  answered: false,
  reviewing: false,
};

function showView(name) {
  for (const [key, node] of Object.entries(views)) node.hidden = key !== name;
  const inSession = name === 'quiz' || name === 'results';
  $('btn-quit').hidden = !inSession;
  $('session-meter').hidden = name !== 'quiz';
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

/* ── setup screen ─────────────────────────────────────────────────── */

function poolFor(filters) {
  return filterQuestions(state.content.questions, filters);
}

function updatePoolSummary() {
  const pool = poolFor(state.filters);
  const take = Math.min(state.filters.length ?? pool.length, pool.length);
  const summary = $('pool-summary');
  const start = $('btn-start');

  if (!pool.length) {
    summary.textContent = 'No questions match these filters.';
    start.disabled = true;
    return;
  }
  start.disabled = false;
  summary.textContent = `${take} question${take === 1 ? '' : 's'} from a pool of ${pool.length}.`;
}

function chipToggle(label, isOn, onToggle, count) {
  const classes = ['chip', 'chip-btn'];
  if (isOn) classes.push('is-on');
  if (count === 0) classes.push('is-empty'); // taxonomy entry with no content yet
  return el('button', {
    type: 'button',
    class: classes.join(' '),
    'aria-pressed': String(isOn),
    onClick: onToggle,
  }, [
    el('span', { text: label }),
    count != null ? el('span', { class: 'chip-count', text: String(count) }) : null,
  ]);
}

function renderSetup() {
  const { competencies, difficultyLevels, questions } = state.content;

  const countFor = (root) =>
    questions.filter((q) => questionRoots(q).includes(root)).length;

  const chips = clear($('competency-chips'));
  competencies.forEach((c) => {
    const count = countFor(c.id);
    chips.append(chipToggle(c.label, state.filters.roots.has(c.id), () => {
      if (state.filters.roots.has(c.id)) state.filters.roots.delete(c.id);
      else state.filters.roots.add(c.id);
      renderSetup();
    }, count));
  });
  if (!state.filters.roots.size) {
    chips.append(el('span', { class: 'muted small', text: 'None selected — all competencies included.' }));
  }

  const diffs = clear($('difficulty-chips'));
  difficultyLevels.forEach((d) => {
    const count = questions.filter((q) => q.difficulty === d.id).length;
    diffs.append(chipToggle(`${d.id} · ${d.label}`, state.filters.difficulties.has(d.id), () => {
      if (state.filters.difficulties.has(d.id)) state.filters.difficulties.delete(d.id);
      else state.filters.difficulties.add(d.id);
      renderSetup();
    }, count));
  });

  const lengths = clear($('length-chips'));
  [...LENGTHS, null].forEach((n) => {
    lengths.append(chipToggle(n == null ? 'All' : String(n), state.filters.length === n, () => {
      state.filters.length = n;
      renderSetup();
    }));
  });

  updatePoolSummary();
}

/* ── quiz screen ──────────────────────────────────────────────────── */

function renderQuestion() {
  const session = state.session;
  const q = current(session);
  const record = session.records.get(q.id);
  state.answered = Boolean(record);

  const total = session.questions.length;
  $('progress-fill').style.width = `${((session.index + (state.answered ? 1 : 0)) / total) * 100}%`;
  $('progress-label').textContent = state.reviewing
    ? `Reviewing ${session.index + 1} of ${total}`
    : `Question ${session.index + 1} of ${total}`;
  $('session-meter').textContent = `${session.index + 1}/${total}`;

  $('q-difficulty').textContent = `${DIFFICULTY_LABEL[q.difficulty] || ''}`;
  $('q-difficulty').className = `badge badge-d${q.difficulty}`;

  const place = $('q-community-type');
  const ct = q.community_type && state.content.byCommunityType.get(q.community_type);
  place.textContent = ct ? ct.label : '';
  place.title = ct?.constraint || '';
  place.hidden = !ct;

  const tags = clear($('q-competencies'));
  competencyLabels(state.content.byRoot, q.competencies).forEach((label) => {
    tags.append(el('span', { class: 'tag', text: label }));
  });

  const scenario = $('q-scenario');
  scenario.textContent = q.scenario || '';
  scenario.hidden = !q.scenario;

  $('q-prompt').textContent = q.prompt;

  $('q-case-link').hidden = !q.case_study;
  if (q.case_study) $('btn-open-case').dataset.file = q.case_study;

  const note = $('q-note');
  const typeNote = {
    'multi-select': 'More than one option is correct.',
    ordering: 'Put the options in order.',
    'numeric-multi': 'Several figures — each one is graded on its own.',
    'open-response': 'Written answer — no answer key.',
  }[q.type];
  note.textContent = typeNote || '';
  note.hidden = !typeNote;

  state.answerControl = renderAnswerArea($('answer-area'), q, record?.response);

  const feedback = $('feedback');
  feedback.hidden = true;
  clear(feedback);

  const submitBtn = $('btn-submit');
  const nextBtn = $('btn-next');
  $('btn-back-results').hidden = !state.reviewing;

  if (state.answered) {
    state.answerControl.lock();
    submitBtn.hidden = true;
    nextBtn.hidden = state.reviewing && isLast(session);
    nextBtn.textContent = state.reviewing
      ? 'Next'
      : (isLast(session) ? 'See results' : 'Next question');
    showFeedback(q, record);
  } else {
    submitBtn.hidden = false;
    submitBtn.disabled = false;
    nextBtn.hidden = true;
    state.answerControl.focusFirst();
  }

  $('keyboard-hint').textContent = ['multiple-choice', 'multi-select'].includes(q.type)
    ? 'Number keys select · Enter submits'
    : 'Enter submits';
}

function showFeedback(q, record) {
  renderFeedback($('feedback'), q, record, {
    onSelfAssess: (value) => setSelfAssessment(state.session, value),
  });
}

function onSubmit(event) {
  event.preventDefault();
  if (state.answered || state.reviewing) return;

  const q = current(state.session);
  const response = state.answerControl.getResponse();

  if (!hasResponse(q, response)) {
    $('keyboard-hint').textContent = {
      'open-response': 'Write something first — then compare against the model answer.',
      'numeric-multi': 'Fill in every figure — a partial decomposition cannot be graded fairly.',
      numeric: 'Enter a number first.',
    }[q.type] || 'Choose an answer first.';
    state.answerControl.focusFirst();
    return;
  }

  $('keyboard-hint').textContent = '';
  submit(state.session, response);
  state.answered = true;
  state.answerControl.lock();
  $('btn-submit').hidden = true;
  $('btn-next').hidden = false;
  $('btn-next').textContent = isLast(state.session) ? 'See results' : 'Next question';
  showFeedback(q, state.session.records.get(q.id));
  $('progress-fill').style.width =
    `${((state.session.index + 1) / state.session.questions.length) * 100}%`;
  // Keep the verdict in view and put the keyboard on Next without scrolling
  // past the explanation the user is meant to read.
  $('feedback').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  $('btn-next').focus({ preventScroll: true });
}

function onNext() {
  if (isLast(state.session)) { showResults(); return; }
  advance(state.session);
  renderQuestion();
}

/* ── results ──────────────────────────────────────────────────────── */

function showResults() {
  state.reviewing = false;
  renderResults($('results-body'), state.session, summarize(state.session), {
    byRoot: state.content.byRoot,
    byCommunityType: state.content.byCommunityType,
    onRetryMissed: () => startSession(missedQuestions(state.session)),
    onRestart: () => { state.session = null; showView('setup'); renderSetup(); },
    onReview: (index) => {
      state.reviewing = true;
      state.session.index = index;
      showView('quiz');
      renderQuestion();
    },
  });
  showView('results');
}

/* ── session lifecycle ────────────────────────────────────────────── */

function startSession(questions) {
  if (!questions.length) return;
  state.session = createSession(questions);
  state.reviewing = false;
  showView('quiz');
  renderQuestion();
}

function startFromFilters() {
  let pool = poolFor(state.filters);
  if (!pool.length) return;
  if (state.filters.shuffle) pool = shuffle(pool);
  else pool = pool.slice().sort((a, b) => a.difficulty - b.difficulty);
  if (state.filters.length) pool = pool.slice(0, state.filters.length);
  startSession(pool);
}

/* ── case study drawer ────────────────────────────────────────────── */

const caseCache = new Map();
let lastFocused = null;

async function openCase(filename) {
  lastFocused = document.activeElement;
  const panel = $('case-panel');
  const body = $('case-body');
  $('case-overlay').hidden = false;
  panel.hidden = false;
  $('btn-close-case').focus();

  if (!caseCache.has(filename)) {
    // The panel is already open at this point, so clear the previous case's
    // heading before awaiting the fetch — otherwise it shows the wrong title
    // for as long as the load takes.
    $('case-title').textContent = 'Loading…';
    body.innerHTML = '<p class="muted">Loading…</p>';
    try {
      caseCache.set(filename, await loadCaseStudy(filename));
    } catch (err) {
      $('case-title').textContent = 'Case study';
      body.replaceChildren(el('p', { class: 'muted', text: err.message }));
      return;
    }
  }

  const { meta, body: rest } = splitFrontMatter(caseCache.get(filename));
  const { title, body: markdown } = extractTitle(rest);
  $('case-title').textContent = meta.title || title || filename;
  body.innerHTML = renderMarkdown(markdown);
  if (meta.setting) {
    body.prepend(el('p', { class: 'case-setting', text: meta.setting }));
  }
  body.scrollTop = 0;
}

function closeCase() {
  $('case-panel').hidden = true;
  $('case-overlay').hidden = true;
  lastFocused?.focus();
}

/* ── keyboard ─────────────────────────────────────────────────────── */

function onKeydown(event) {
  if (event.key === 'Escape' && !$('case-panel').hidden) { closeCase(); return; }
  if (views.quiz.hidden) return;

  // Only text entry swallows the shortcut keys — a focused radio or checkbox
  // should still respond to the number keys.
  const target = event.target;
  const typing = target.tagName === 'TEXTAREA'
    || target.tagName === 'SELECT'
    || (target.tagName === 'INPUT' && !['radio', 'checkbox'].includes(target.type));

  if (event.key === 'Enter' && !event.shiftKey) {
    if (target.tagName === 'TEXTAREA') return; // newlines in prose
    if (!$('btn-next').hidden) { event.preventDefault(); onNext(); }
    else if (!$('btn-submit').hidden) { event.preventDefault(); onSubmit(event); }
    return;
  }

  if (typing || state.answered) return;
  if (/^[1-9]$/.test(event.key) && state.answerControl?.quickPick) {
    event.preventDefault();
    state.answerControl.quickPick(Number(event.key));
  }
}

/* ── boot ─────────────────────────────────────────────────────────── */

async function boot() {
  try {
    state.content = await loadContent();
  } catch (err) {
    $('error-detail').textContent = err.message;
    showView('error');
    return;
  }

  if (!state.content.questions.length) {
    $('error-detail').textContent = 'The question bank loaded but contains no usable questions.';
    showView('error');
    return;
  }

  if (state.content.warnings.length) {
    const box = $('content-warnings');
    box.hidden = false;
    box.textContent = `Content warnings (${state.content.warnings.length}): `
      + state.content.warnings.join(' · ');
    console.warn('[CityGovTrainer] content warnings:\n' + state.content.warnings.join('\n'));
  }

  renderSetup();
  showView('setup');
}

$('answer-form').addEventListener('submit', onSubmit);
$('btn-next').addEventListener('click', onNext);
$('btn-back-results').addEventListener('click', showResults);
$('btn-start').addEventListener('click', startFromFilters);
$('btn-quit').addEventListener('click', () => {
  state.session = null;
  showView('setup');
  renderSetup();
});
$('btn-open-case').addEventListener('click', (e) => openCase(e.currentTarget.dataset.file));
$('btn-close-case').addEventListener('click', closeCase);
$('case-overlay').addEventListener('click', closeCase);
document.querySelector('[data-select="all"]').addEventListener('click', () => {
  state.content.competencies.forEach((c) => state.filters.roots.add(c.id));
  renderSetup();
});
document.querySelector('[data-select="none"]').addEventListener('click', () => {
  state.filters.roots.clear();
  renderSetup();
});
$('opt-shuffle').addEventListener('change', (e) => {
  state.filters.shuffle = e.currentTarget.checked;
});
document.addEventListener('keydown', onKeydown);

boot();
