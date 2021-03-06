export const performanceGatherers = [
  'css-usage',
  'js-usage',
  'viewport-dimensions',
  'console-messages',
  'anchor-elements',
  'image-elements',
  'link-elements',
  'meta-elements',
  'script-elements',
  'iframe-elements',
  'form-elements',
  'main-document-content',
  'global-listeners',
  'dobetterweb/doctype',
  'dobetterweb/domstats',
  'dobetterweb/optimized-images',
  'dobetterweb/password-inputs-with-prevented-paste',
  'dobetterweb/response-compression',
  'dobetterweb/tags-blocking-first-paint',
  'seo/font-size',
  'seo/embedded-content',
  'seo/robots-txt',
  'seo/tap-targets',
  'accessibility',
  'trace-elements',
  'inspector-issues',
  'source-maps',
];

export const complianceGatherersRaw = ['all-text'];

export const complianceGatherers = complianceGatherersRaw.map((gather) => 'src/gather/' + gather);
