module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/bdd/steps/**/*.ts'],
    format: ['pretty'],
    paths: ['src/bdd/features/**/*.feature'],
    parallel: 1,
    timeout: 30000,
    retry: 1,
    failFast: false
  },
  html: {
    requireModule: ['ts-node/register'],
    require: ['src/bdd/steps/**/*.ts'],
    format: ['html:reports/cucumber-report.html'],
    paths: ['src/bdd/features/**/*.feature'],
    parallel: 1,
    timeout: 30000
  },
  json: {
    requireModule: ['ts-node/register'],
    require: ['src/bdd/steps/**/*.ts'],
    format: ['json:reports/cucumber-report.json'],
    paths: ['src/bdd/features/**/*.feature'],
    parallel: 1,
    timeout: 30000
  }
};
