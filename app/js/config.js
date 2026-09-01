/**
 * Where the app reads content from. Paths are relative to /app/.
 *
 * Adding a question file is a one-line change here — files are concatenated in
 * order, so content can be split by competency or by author.
 */
export const CONTENT = {
  taxonomy: '../taxonomy/competencies.json',
  questionFiles: [
    '../quiz-data/questions.sample.json',
    '../quiz-data/questions.downtown-redevelopment.json',
  ],
  caseStudyDir: '../case-studies/',
};

/** Session length choices offered on the setup screen. */
export const LENGTHS = [5, 10, 20];
