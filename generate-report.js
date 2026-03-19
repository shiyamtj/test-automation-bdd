// generate-report.js
// Generates a combined HTML report from Cucumber JSON output using multiple-cucumber-html-reporter.

const reporter = require('multiple-cucumber-html-reporter');

reporter.generate({
  // Required options
  jsonDir: './test-results',            // folder containing cucumber JSON files
  reportPath: './reports',               // where the HTML report will be written

  // Optional customisation (feel free to adjust)
  pageTitle: 'Test‑Automation BDD – Cucumber Report',
  reportName: 'Nightly Build',
  openReportInBrowser: false,
  hideMetadata: true,
  // metadata: {
  //   browser: { name: 'chrome', version: '115' },
  //   device: 'Windows‑10 VM',
  //   platform: { name: 'windows', version: '10' }
  // },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Report generated at', value: new Date().toLocaleString() }
    ]
  }
});
