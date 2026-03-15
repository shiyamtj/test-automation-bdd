module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    require: ['tests/support/**/*.ts', 'tests/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    parallel: 2,
    dryRun: false,
    failFast: false,
    strict: true,
    retry: 0
  }
};
