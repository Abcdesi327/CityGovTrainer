/**
 * Grading is per question type. Every result carries a `status`:
 *   'correct' | 'incorrect' | 'ungraded'
 *
 * 'ungraded' is open-response. There is no machine answer key, so the app shows
 * the model reasoning and asks the user to self-assess — which is honest about
 * its limits and ships without an LLM call in the loop.
 */

const sameSet = (a, b) => {
  const A = new Set(a); const B = new Set(b);
  return A.size === B.size && [...A].every((x) => B.has(x));
};

const sameOrder = (a, b) =>
  a.length === b.length && a.every((x, i) => x === b[i]);

/**
 * Is one numeric value inside its accepted band?
 *
 * Two ways to state the band: answer_tolerance (symmetric, the common case) or
 * answer_range (explicit min/max, for when the defensible spread is lopsided —
 * under-forecasting revenue is not the same mistake as over-forecasting it).
 * answer_range wins if both are present.
 */
export function numericWithinBand(value, spec) {
  if (!Number.isFinite(value)) return { ok: false, unparsed: true };

  const range = spec.answer_range;
  if (range && Number.isFinite(range.min) && Number.isFinite(range.max)) {
    // Epsilon on both edges, for the same floating-point reason as below.
    return {
      ok: value - range.min >= -1e-9 && value - range.max <= 1e-9,
      min: range.min,
      max: range.max,
    };
  }

  const tol = Number.isFinite(spec.answer_tolerance) ? spec.answer_tolerance : 0;
  const off = Math.abs(value - spec.answer);
  // Compare with a small epsilon: 21.64 - 21.34 is 0.30000000000000071 in
  // binary floating point, and a learner who lands exactly on the stated
  // tolerance should not be marked wrong for it.
  return { ok: off - tol <= 1e-9, off, tol };
}

export function grade(question, response) {
  switch (question.type) {
    case 'multiple-choice':
      return {
        status: response === question.answer ? 'correct' : 'incorrect',
      };

    case 'multi-select': {
      const picked = response || [];
      const key = question.answer || [];
      if (sameSet(picked, key)) return { status: 'correct' };
      const missed = key.filter((id) => !picked.includes(id));
      const extra = picked.filter((id) => !key.includes(id));
      return { status: 'incorrect', missed, extra };
    }

    case 'ordering':
      return {
        status: sameOrder(response || [], question.answer || [])
          ? 'correct'
          : 'incorrect',
      };

    case 'numeric': {
      const band = numericWithinBand(Number(response), question);
      return { status: band.ok ? 'correct' : 'incorrect', ...band };
    }

    case 'numeric-multi': {
      // Each part stands alone, so the feedback can say which figure went wrong
      // rather than just marking the whole decomposition incorrect.
      const given = response || {};
      const parts = (question.parts || []).map((part) => {
        const raw = given[part.id];
        const band = numericWithinBand(Number(raw), part);
        return { id: part.id, value: raw, ...band };
      });
      const correct = parts.filter((p) => p.ok).length;
      return {
        status: correct === parts.length && parts.length ? 'correct' : 'incorrect',
        parts,
        correct,
        total: parts.length,
      };
    }

    case 'open-response':
      return { status: 'ungraded' };

    default:
      return { status: 'ungraded' };
  }
}

/** True when the user actually committed something answerable. */
export function hasResponse(question, response) {
  switch (question.type) {
    case 'multiple-choice':
      return typeof response === 'string' && response.length > 0;
    case 'multi-select':
      return Array.isArray(response) && response.length > 0;
    case 'ordering':
      return Array.isArray(response) && response.length > 0;
    case 'numeric':
      return response !== '' && response != null && Number.isFinite(Number(response));
    case 'numeric-multi':
      // Every part must be filled in — a partly answered decomposition cannot be
      // graded fairly, and silently scoring blanks as wrong would be worse.
      return Boolean(response)
        && (question.parts || []).every((part) => {
          const v = response[part.id];
          return v !== '' && v != null && Number.isFinite(Number(v));
        });
    case 'open-response':
      return typeof response === 'string' && response.trim().length > 0;
    default:
      return false;
  }
}

/**
 * A bare currency sign belongs in front of the figure; everything else — %, FTE,
 * $M, jobs — reads as a suffix.
 */
export const unitIsPrefix = (unit) => unit === '$';

/** A number with its unit attached on the correct side. */
export function withUnit(value, unit) {
  if (!unit) return String(value);
  return unitIsPrefix(unit) ? `${unit}${value}` : `${value} ${unit}`;
}

/** How a numeric band reads in the feedback panel, units included. */
export function numericKeyText(spec, unit) {
  const range = spec.answer_range;
  if (range && Number.isFinite(range.min) && Number.isFinite(range.max)) {
    return unitIsPrefix(unit)
      ? `${withUnit(range.min, unit)}–${withUnit(range.max, unit)}`
      : `${range.min}–${range.max}${unit ? ` ${unit}` : ''}`;
  }
  return Number.isFinite(spec.answer_tolerance)
    ? `${withUnit(spec.answer, unit)} (± ${spec.answer_tolerance})`
    : withUnit(spec.answer, unit);
}

/** Human-readable form of the answer key, for the feedback panel. */
export function answerKeyText(question, optionText) {
  switch (question.type) {
    case 'multiple-choice':
      return optionText(question.answer);
    case 'multi-select':
      return (question.answer || []).map(optionText).join(' · ');
    case 'ordering':
      return (question.answer || []).map((id, i) => `${i + 1}. ${optionText(id)}`).join('\n');
    case 'numeric':
      return numericKeyText(question, question.answer_unit);
    default:
      return '';
  }
}
