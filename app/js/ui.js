import { shuffle } from './data.js';
import { answerKeyText, numericKeyText } from './grading.js';

/* ── tiny DOM helpers ─────────────────────────────────────────────── */

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export const clear = (node) => { node.replaceChildren(); return node; };

/* ── question metadata ────────────────────────────────────────────── */

export const DIFFICULTY_LABEL = { 1: 'Foundational', 2: 'Applied', 3: 'Judgment' };

export function competencyLabel(byRoot, tag) {
  const [root, sub] = String(tag).split('/');
  const label = byRoot.get(root)?.label || root;
  return sub ? `${label} · ${sub.replace(/-/g, ' ')}` : label;
}

/**
 * Labels for a question's tags, grouped by root so a question carrying two
 * subtopics of one competency reads "Finance · forecasting, reserves policy"
 * rather than naming the competency twice.
 */
export function competencyLabels(byRoot, tags) {
  const groups = new Map();
  for (const tag of tags || []) {
    const [root, sub] = String(tag).split('/');
    if (!groups.has(root)) groups.set(root, []);
    if (sub) groups.get(root).push(sub.replace(/-/g, ' '));
  }
  return [...groups].map(([root, subs]) => {
    const label = byRoot.get(root)?.label || root;
    return subs.length ? `${label} · ${subs.join(', ')}` : label;
  });
}

/* ── answer inputs ────────────────────────────────────────────────── */

/**
 * Renders the input for a question and returns a controller:
 *   { getResponse(), lock(), focusFirst(), quickPick(n) }
 *
 * `initial` pre-fills a previously given response — used when reviewing a
 * finished session.
 */
export function renderAnswerArea(container, question, initial) {
  clear(container);
  switch (question.type) {
    case 'multiple-choice': return choiceInput(container, question, false, initial);
    case 'multi-select': return choiceInput(container, question, true, initial);
    case 'ordering': return orderingInput(container, question, initial);
    case 'numeric': return numericInput(container, question, initial);
    case 'numeric-multi': return numericMultiInput(container, question, initial);
    case 'open-response': return openInput(container, question, initial);
    default: return { getResponse: () => null, lock() {}, focusFirst() {} };
  }
}

function choiceInput(container, question, multi, initial) {
  const name = `q-${question.id}`;
  const preset = new Set([].concat(initial || []));
  const inputs = [];

  const list = el('div', { class: 'options', role: multi ? 'group' : 'radiogroup' });
  question.options.forEach((opt, i) => {
    const input = el('input', {
      type: multi ? 'checkbox' : 'radio',
      name,
      value: opt.id,
      id: `${name}-${opt.id}`,
    });
    if (preset.has(opt.id)) input.checked = true;
    inputs.push(input);
    list.append(el('label', { class: 'option', for: `${name}-${opt.id}` }, [
      input,
      el('span', { class: 'option-key', text: String(i + 1) }),
      el('span', { class: 'option-text', text: opt.text }),
    ]));
  });
  container.append(list);

  if (multi) {
    container.append(el('p', {
      class: 'muted small',
      text: 'Select every option that applies.',
    }));
  }

  return {
    getResponse() {
      const picked = inputs.filter((i) => i.checked).map((i) => i.value);
      return multi ? picked : (picked[0] ?? '');
    },
    lock() { inputs.forEach((i) => { i.disabled = true; }); },
    focusFirst() { inputs[0]?.focus(); },
    quickPick(n) {
      const input = inputs[n - 1];
      if (!input || input.disabled) return;
      if (multi) input.checked = !input.checked;
      else input.checked = true;
      input.focus();
    },
  };
}

function orderingInput(container, question, initial) {
  // Start from a shuffled order so the list itself never gives away the answer.
  let order = shuffle(question.options.map((o) => o.id));
  if (order.join() === (question.answer || []).join() && order.length > 1) {
    order = [...order.slice(1), order[0]];
  }
  if (Array.isArray(initial) && initial.length === question.options.length) {
    order = initial.slice();
  }
  const byId = new Map(question.options.map((o) => [o.id, o]));
  let locked = false;

  const list = el('ol', { class: 'ordering' });
  container.append(
    el('p', { class: 'muted small', text: 'Arrange from highest to lowest priority.' }),
    list,
  );

  const move = (index, delta) => {
    const target = index + delta;
    if (locked || target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    draw();
    list.querySelectorAll('.ordering-item')[target]
      ?.querySelector(delta < 0 ? '[data-dir="up"]' : '[data-dir="down"]')?.focus();
  };

  function draw() {
    clear(list);
    order.forEach((id, i) => {
      list.append(el('li', { class: 'ordering-item' }, [
        el('span', { class: 'ordering-rank', text: String(i + 1) }),
        el('span', { class: 'ordering-text', text: byId.get(id).text }),
        el('span', { class: 'ordering-controls' }, [
          el('button', {
            type: 'button', class: 'icon-btn', dataset: { dir: 'up' },
            'aria-label': `Move "${byId.get(id).text}" up`,
            disabled: locked || i === 0,
            onClick: () => move(i, -1),
          }, '↑'),
          el('button', {
            type: 'button', class: 'icon-btn', dataset: { dir: 'down' },
            'aria-label': `Move "${byId.get(id).text}" down`,
            disabled: locked || i === order.length - 1,
            onClick: () => move(i, 1),
          }, '↓'),
        ]),
      ]));
    });
  }
  draw();

  return {
    getResponse: () => order.slice(),
    lock() { locked = true; draw(); },
    focusFirst() { list.querySelector('button')?.focus(); },
  };
}

function numericInput(container, question, initial) {
  const input = el('input', {
    type: 'number', step: 'any', class: 'text-input', id: `num-${question.id}`,
    placeholder: 'Your estimate', inputmode: 'decimal',
    value: initial == null ? '' : String(initial),
  });
  container.append(el('div', { class: 'numeric-row' }, [
    el('span', { class: 'input-with-unit' }, [
      input,
      question.answer_unit ? el('span', { class: 'unit', text: question.answer_unit }) : null,
    ]),
  ]));
  const band = question.answer_range
    ? `Judged against a range — the method matters more than the arithmetic.`
    : (Number.isFinite(question.answer_tolerance)
      ? `Judged within ±${question.answer_tolerance} — the method matters more than the arithmetic.`
      : null);
  if (band) container.append(el('p', { class: 'muted small', text: band }));
  return {
    getResponse: () => input.value,
    lock() { input.disabled = true; },
    focusFirst() { input.focus(); },
  };
}

function numericMultiInput(container, question, initial) {
  const inputs = new Map();
  const parts = question.parts || [];

  container.append(
    el('p', { class: 'muted small', text: 'Give every figure — the decomposition is the point.' }),
    el('div', { class: 'parts' }, parts.map((part) => {
      const id = `part-${question.id}-${part.id}`;
      const input = el('input', {
        type: 'number', step: 'any', class: 'text-input', id, inputmode: 'decimal',
        value: initial && initial[part.id] != null ? String(initial[part.id]) : '',
      });
      inputs.set(part.id, input);
      return el('div', { class: 'part-row' }, [
        el('label', { class: 'part-label', for: id, text: part.label }),
        el('span', { class: 'input-with-unit' }, [
          input,
          part.unit ? el('span', { class: 'unit', text: part.unit }) : null,
        ]),
      ]);
    })),
  );

  return {
    getResponse: () => Object.fromEntries([...inputs].map(([id, i]) => [id, i.value])),
    lock() { inputs.forEach((i) => { i.disabled = true; }); },
    focusFirst() { const first = inputs.values().next().value; if (first) first.focus(); },
  };
}

function openInput(container, question, initial) {
  const area = el('textarea', {
    class: 'text-input textarea', rows: '7', id: `open-${question.id}`,
    placeholder: 'Write your answer. You will compare it against a model response.',
  });
  if (initial) area.value = initial;
  container.append(area);
  container.append(el('p', {
    class: 'muted small',
    text: 'No answer key — this one is graded by you, against the model reasoning.',
  }));
  return {
    getResponse: () => area.value,
    lock() { area.disabled = true; },
    focusFirst() { area.focus(); },
  };
}

/* ── feedback ─────────────────────────────────────────────────────── */

const STATUS_COPY = {
  correct: { class: 'ok', label: 'Correct' },
  incorrect: { class: 'bad', label: 'Not quite' },
  ungraded: { class: 'neutral', label: 'Answer recorded' },
};

export function renderFeedback(container, question, record, { onSelfAssess } = {}) {
  clear(container);
  const { result, response } = record;
  const meta = STATUS_COPY[result.status];
  const optionText = (id) =>
    (question.options || []).find((o) => o.id === id)?.text || id;

  container.className = `feedback show ${meta.class}`;
  container.append(el('p', { class: 'verdict', text: meta.label }));

  if (question.type === 'multiple-choice' || question.type === 'multi-select') {
    const picked = new Set([].concat(response || []));
    const key = new Set([].concat(question.answer || []));
    container.append(el('ul', { class: 'rationales' },
      question.options.map((opt) => {
        const marks = [];
        if (key.has(opt.id)) marks.push(el('span', { class: 'mark mark-key', text: 'Answer' }));
        if (picked.has(opt.id)) marks.push(el('span', { class: 'mark mark-you', text: 'Your pick' }));
        return el('li', { class: key.has(opt.id) ? 'rationale is-key' : 'rationale' }, [
          el('div', { class: 'rationale-head' }, [
            el('span', { class: 'rationale-text', text: opt.text }),
            ...marks,
          ]),
          opt.rationale && el('p', { class: 'rationale-body', text: opt.rationale }),
        ]);
      })));
  }

  if (question.type === 'ordering') {
    container.append(
      el('p', { class: 'kicker', text: 'Reference ordering' }),
      el('ol', { class: 'key-order' },
        (question.answer || []).map((id) => {
          const opt = (question.options || []).find((o) => o.id === id);
          return el('li', {}, [
            el('span', { text: opt?.text || id }),
            opt?.rationale && el('p', { class: 'rationale-body', text: opt.rationale }),
          ]);
        })),
    );
  }

  if (question.type === 'numeric') {
    const unit = question.answer_unit ? ` ${question.answer_unit}` : '';
    container.append(el('p', { class: 'numeric-verdict' }, [
      el('span', { class: 'muted', text: 'You answered ' }),
      el('strong', { text: `${response}${unit}` }),
      el('span', { class: 'muted', text: ' · accepted ' }),
      el('strong', { text: answerKeyText(question, optionText) }),
    ]));
  }

  if (question.type === 'numeric-multi') {
    const byId = new Map((result.parts || []).map((p) => [p.id, p]));
    container.append(
      el('p', { class: 'kicker', text: `${result.correct} of ${result.total} figures` }),
      el('ul', { class: 'rationales' }, (question.parts || []).map((part) => {
        const got = byId.get(part.id) || {};
        const unit = part.unit ? ` ${part.unit}` : '';
        return el('li', { class: got.ok ? 'rationale is-key' : 'rationale' }, [
          el('div', { class: 'rationale-head' }, [
            el('span', { class: 'rationale-text', text: part.label }),
            el('span', {
              class: got.ok ? 'mark mark-key' : 'mark mark-you',
              text: got.ok ? 'Correct' : 'Off',
            }),
          ]),
          el('p', { class: 'rationale-body' }, [
            el('span', { text: `You gave ${got.value === '' || got.value == null ? '—' : got.value}${unit} · accepted ${numericKeyText(part, part.unit)}` }),
          ]),
          part.rationale ? el('p', { class: 'rationale-body', text: part.rationale }) : null,
        ]);
      })),
    );
  }

  if (question.type === 'open-response') {
    if (String(response || '').trim()) {
      container.append(
        el('p', { class: 'kicker', text: 'Your answer' }),
        el('blockquote', { class: 'your-answer', text: response }),
      );
    }
    container.append(el('p', { class: 'kicker', text: 'What a strong answer covers' }));
  }

  container.append(
    el('p', { class: 'kicker', text: question.type === 'open-response' ? '' : 'Why' }),
    el('p', { class: 'explanation', text: question.explanation }),
  );

  if ((question.tags || []).includes('defensible-alternatives-exist')) {
    container.append(el('p', {
      class: 'note',
      text: 'Heuristic, not a rule — reasonable practitioners defend other answers here.',
    }));
  }

  if (question.source_tier) {
    const label = {
      'public-domain': 'Grounded in public-domain government material — figures usable directly.',
      'link-only': 'Grounded in copyrighted material — original composite, cited by link.',
      'design-reference': 'Structure drawn from a paid source; no content reproduced.',
      original: 'Originally written, with no external grounding.',
    }[question.source_tier];
    if (label) container.append(el('p', { class: 'muted small provenance', text: label }));
  }

  if (question.data_reference) {
    const dr = question.data_reference;
    container.append(el('p', { class: 'muted small' }, [
      el('strong', { text: 'Data: ' }),
      dr.url
        ? el('a', { href: dr.url, target: '_blank', rel: 'noopener noreferrer', text: dr.source || dr.url })
        : document.createTextNode(dr.source || ''),
      dr.notes ? document.createTextNode(` — ${dr.notes}`) : null,
    ]));
  }

  if ((question.further_reading || []).length) {
    container.append(
      el('p', { class: 'kicker', text: 'Further reading' }),
      el('ul', { class: 'links' }, question.further_reading.map((ref) => el('li', {}, [
        ref.url
          ? el('a', { href: ref.url, target: '_blank', rel: 'noopener noreferrer', text: ref.title || ref.url })
          : document.createTextNode(ref.title || ''),
      ]))),
    );
  }

  if (result.status === 'ungraded' && onSelfAssess) {
    const options = [
      ['covered', 'I covered this'],
      ['partial', 'Partly'],
      ['missed', 'I missed it'],
    ];
    const group = el('div', { class: 'self-assess' }, [
      el('p', { class: 'kicker', text: 'How did yours compare?' }),
      el('div', { class: 'chips' }, options.map(([value, label]) => el('button', {
        type: 'button',
        class: record.selfAssess === value ? 'chip chip-btn is-on' : 'chip chip-btn',
        onClick: (event) => {
          onSelfAssess(value);
          group.querySelectorAll('.chip-btn').forEach((b) => b.classList.remove('is-on'));
          event.currentTarget.classList.add('is-on');
        },
      }, label))),
    ]);
    container.append(group);
  }

  container.hidden = false;
}

/* ── results ──────────────────────────────────────────────────────── */

export function renderResults(container, session, summary, { byRoot, onRetryMissed, onRestart, onReview }) {
  clear(container);
  const { totals, byCompetency, byDifficulty, selfAssessed } = summary;
  const pct = totals.graded ? Math.round((totals.correct / totals.graded) * 100) : null;

  container.append(el('div', { class: 'card results-head' }, [
    el('p', { class: 'kicker', text: 'Session complete' }),
    el('div', { class: 'score' }, [
      el('span', { class: 'score-value', text: pct == null ? '—' : `${pct}%` }),
      el('span', { class: 'score-detail', text: totals.graded
        ? `${totals.correct} of ${totals.graded} graded questions`
        : 'No machine-graded questions in this session' }),
    ]),
    totals.ungraded ? el('p', { class: 'muted small', text:
      `${totals.ungraded} open-response question${totals.ungraded === 1 ? '' : 's'} — `
      + `self-assessed: ${selfAssessed.covered} covered, ${selfAssessed.partial} partly, `
      + `${selfAssessed.missed} missed`
      + (selfAssessed.unrated ? `, ${selfAssessed.unrated} unrated` : '') }) : null,
  ]));

  if (byCompetency.size) {
    const rows = [...byCompetency.entries()]
      .map(([root, b]) => ({
        root,
        label: byRoot.get(root)?.label || root,
        ...b,
        rate: b.graded ? b.correct / b.graded : null,
      }))
      .sort((a, b) => (a.rate ?? 2) - (b.rate ?? 2));

    container.append(el('div', { class: 'card' }, [
      el('h2', { class: 'card-title', text: 'Where you are thin' }),
      el('p', { class: 'muted small', text: 'Weakest competency first. Coverage this shallow is indicative, not diagnostic.' }),
      el('ul', { class: 'bars' }, rows.map((r) => el('li', { class: 'bar-row' }, [
        el('span', { class: 'bar-label', text: r.label }),
        el('span', { class: 'bar-track' }, [
          el('span', {
            class: 'bar-fill',
            style: `width:${r.rate == null ? 0 : Math.round(r.rate * 100)}%`,
          }),
        ]),
        el('span', { class: 'bar-value', text: r.graded
          ? `${r.correct}/${r.graded}`
          : `${r.ungraded} open` }),
      ]))),
    ]));
  }

  if (byDifficulty.size) {
    container.append(el('div', { class: 'card' }, [
      el('h2', { class: 'card-title', text: 'By difficulty' }),
      el('ul', { class: 'bars' }, [...byDifficulty.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([level, b]) => el('li', { class: 'bar-row' }, [
          el('span', { class: 'bar-label', text: `${level} · ${DIFFICULTY_LABEL[level] || ''}` }),
          el('span', { class: 'bar-track' }, [
            el('span', {
              class: 'bar-fill',
              style: `width:${b.graded ? Math.round((b.correct / b.graded) * 100) : 0}%`,
            }),
          ]),
          el('span', { class: 'bar-value', text: b.graded ? `${b.correct}/${b.graded}` : `${b.ungraded} open` }),
        ]))),
    ]));
  }

  container.append(el('div', { class: 'card' }, [
    el('h2', { class: 'card-title', text: 'Review' }),
    el('ul', { class: 'review' }, session.questions.map((q, i) => {
      const rec = session.records.get(q.id);
      const status = rec ? rec.result.status : 'skipped';
      return el('li', { class: `review-row ${status}` }, [
        el('button', { type: 'button', class: 'review-btn', onClick: () => onReview(i) }, [
          el('span', { class: `dot dot-${status}`, 'aria-hidden': true }),
          el('span', { class: 'review-text', text: q.prompt }),
          el('span', { class: 'review-meta', text: DIFFICULTY_LABEL[q.difficulty] || '' }),
        ]),
      ]);
    })),
  ]));

  const missed = session.questions.filter((q) => {
    const rec = session.records.get(q.id);
    return rec && (rec.result.status === 'incorrect'
      || (rec.result.status === 'ungraded' && rec.selfAssess === 'missed'));
  });

  container.append(el('div', { class: 'actions actions-end' }, [
    missed.length ? el('button', {
      class: 'btn btn-primary', onClick: onRetryMissed,
      text: `Retry the ${missed.length} I missed`,
    }) : null,
    el('button', { class: 'btn', onClick: onRestart, text: 'New session' }),
  ]));
}
