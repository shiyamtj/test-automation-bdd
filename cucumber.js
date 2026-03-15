module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    require: ['tests/hooks/**/*.ts', 'tests/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json'
    ],
    parallel: 2,
    dryRun: false,
    failFast: false,
    strict: true,
    retry: 0
  },
  smoke: {
    paths: ['tests/features/**/*.feature'],
    require: ['tests/hooks/**/*.ts', 'tests/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html'
    ],
    tags: '@smoke'
  }
};
