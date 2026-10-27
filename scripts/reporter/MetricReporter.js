const fs = require('fs');

class MetricReporter {

    constructor() {
        this.total = 0;
        this.passed = 0;
        this.failed = 0;
        this.flaky = 0;
    }

    onTestEnd(test, result) {

        this.total++;

        if (result.status === 'passed') {

            if (result.retry > 0) {
                this.flaky++;
            } else {
                this.passed++;
            }

        } else if (result.status === 'failed') {
            this.failed++;
        }
    }

    onEnd() {

        const passRate =
            ((this.passed + this.flaky) / this.total * 100).toFixed(2);

        const flakyRate =
            ((this.flaky / this.total) * 100).toFixed(2);

        const retrySuccessRate =
            this.flaky > 0
                ? ((this.flaky / (this.flaky + this.failed)) * 100).toFixed(2)
                : '0.00';

        const metrics = `
Pass Rate=${passRate}%
Flaky Rate=${flakyRate}%
Retry Success Rate=${retrySuccessRate}%
`;

        if (!fs.existsSync('allure-results')) {
            fs.mkdirSync('allure-results');
        }

        fs.writeFileSync(
            'allure-results/environment.properties',
            metrics
        );

        console.log('\n=== Automation Metrics ===');
        console.log(metrics);
    }
}

module.exports = MetricReporter;
