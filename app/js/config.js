/**
 * Where the app reads content from.
 *
 * The list of content files lives in quiz-data/manifest.json, not here, so that
 * adding a question file is a data change rather than a code change. Question
 * JSON is fetched with cache: 'no-store' and is always current; a JavaScript
 * module is not — it is cached by the browser and the CDN like any other asset,
 * so a content list embedded in this file can lag behind the content itself
 * after a deploy.
 *
 * MANIFEST is resolved relative to /app/. Paths inside the manifest are
 * relative to the repository root, and ROOT joins them back up.
 */
export const MANIFEST = '../quiz-data/manifest.json';
export const ROOT = '../';

/** Used only if the manifest cannot be loaded. Kept in sync with it. */
export const FALLBACK_CONTENT = {
  taxonomy: '../taxonomy/competencies.json',
  communityTypes: '../taxonomy/community-types.json',
  questionFiles: [
    '../quiz-data/questions.sample.json',
    '../quiz-data/questions.downtown-redevelopment.json',
    '../quiz-data/questions.community-economic-development.json',
  ],
  caseStudyDir: '../case-studies/',
};

/** Session length choices offered on the setup screen. */
export const LENGTHS = [5, 10, 20];
