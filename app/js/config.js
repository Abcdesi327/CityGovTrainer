/**
 * Where the app reads content from. Paths are relative to /app/.
 *
 * These match the current flat repository layout. When question files move under
 * quiz-data/ and case studies under case-studies/ (see README), update these two
 * entries and nothing else in the app needs to change.
 */
export const CONTENT = {
  taxonomy: '../competencies.json',
  questionFiles: [
    '../questions.sample.json',
  ],
  caseStudyDir: '../',
};

/** Session length choices offered on the setup screen. */
export const LENGTHS = [5, 10, 20];
