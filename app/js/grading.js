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
      const value = Number(response);
      if (!Number.isFinite(value)) return { status: 'incorrect', unparsed: true };
      // Authoring guide requires a tolerance; fall back to exact if absent.
      const tol = Number.isFinite(question.answer_tolerance)
        ? question.answer_tolerance
        : 0;
      const off = Math.abs(value - question.answer);
      // Compare with a small epsilon: 21.64 - 21.34 is 0.30000000000000071 in
      // binary floating point, and a learner who lands exactly on the stated
      // tolerance should not be marked wrong for it.
      return { status: off - tol <= 1e-9 ? 'correct' : 'incorrect', off, tol };
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
    case 'open-response':
      return typeof response === 'string' && response.trim().length > 0;
    default:
      return false;
  }
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
    case 'numeric': {
      const tol = question.answer_tolerance;
      return Number.isFinite(tol)
        ? `${question.answer} (± ${tol})`
        : String(question.answer);
    }
    default:
      return '';
  }
}
