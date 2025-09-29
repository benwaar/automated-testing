module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/steps/**/*.ts'],
    format: ['pretty'],
    paths: ['tests/features/**/*.feature'],
    parallel: 1,
    timeout: 30000,
    retry: 1,
    failFast: false
  },
  html: {
    requireModule: ['ts-node/register'],
    require: ['tests/steps/**/*.ts'],
    format: ['html:reports/cucumber-report.html'],
    paths: ['tests/features/**/*.feature'],
    parallel: 1,
    timeout: 30000
  },
  json: {
    requireModule: ['ts-node/register'],
    require: ['tests/steps/**/*.ts'],
    format: ['json:reports/cucumber-report.json'],
    paths: ['tests/features/**/*.feature'],
    parallel: 1,
    timeout: 30000
  }
};