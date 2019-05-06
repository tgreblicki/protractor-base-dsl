var os = require('os');

var AsciiTable = require('ascii-table');
var {Window} = require('protractor-base-dsl');
var R = require('ramda');
var DEFAULT_TIMEOUT = 600000;
var ScreenShotReporter = require('protractor-screenshot-reporter');

var browserName = process.env.SELENIUM_TEST_BROWSER || 'chrome';
var platform = (process.env.SELENIUM_TEST_PLATFORM || 'any').toLowerCase();

var seleniumVersions = require('../../../gulp/tasks/selenium-versions.json');

var hostname = require('../../../gulp/utils/hostname');

function printBanner() {
    var table = new AsciiTable('Configuration');
    table
        .addRow('Host', R.propOr('localhost', 'SELENIUM_TEST_ADDR', process.env))
        .addRow('Browser', R.propOr(`Not set. Using default.`, 'SELENIUM_TEST_BROWSER', process.env))
        .addRow('Platform', R.propOr(`Not set. Using local: (${os.platform()})`, 'SELENIUM_TEST_PLATFORM', process.env));
    console.log(table.toString());
}

exports.config = {
    allScriptsTimeout: DEFAULT_TIMEOUT,
    baseUrl: 'http://' + hostname + ':' + 6006 + '/',
    capabilities: {
        browserName,
        platform,
        platformName: platform,
        requireWindowFocus: true
    },
    framework: 'jasmine2',
    troubleshoot: true,
    getPageTimeout: DEFAULT_TIMEOUT,
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: DEFAULT_TIMEOUT,
        print: R.F
    },
    rootElement: 'body',
    seleniumAddress: (process.env.SELENIUM_TEST_ADDR || null),
    specs: ['../scenario/**/*.*js'],
    suites: {
        'components': '../scenario/*.*js'
    },
    onPrepare: function () {
        require('@babel/register')({
            presets: [
                '@babel/preset-env'
            ]
        });

        global.defaultExpectationTimeout = 5000;
        global.defaultBrowserWidth = 1024;
        global.defaultBrowserHeight = 768;

        var reporters = require('jasmine-reporters');
        var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
        var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

        jasmine.getEnv().addReporter(new reporters.JUnitXmlReporter({
            consolidateAll: false,
            savePath: 'build/test-results/protractor'
        }));

        jasmine.getEnv().addReporter(new ScreenShotReporter({
            baseDirectory: 'build/screenshots'
        }));

        jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
            savePath: 'build/reports/e2e/',
            takeScreenshots: true,
            takeScreenshotsOnlyOnFailures: true
        }));

        jasmine.getEnv().addReporter(new SpecReporter({
            suite: {
                displayNumber: true
            },
            spec: {
                displayErrorMessages: true,
                displayStacktrace: true,
                displaySuccessful: true,
                displayFailed: true,
                displayPending: true,
                displayDuration: true
            }
        }));

        var failFast = require('jasmine-fail-fast');
        jasmine.getEnv().addReporter(failFast.init());

        browser.ignoreSynchronization = true;
        Window.setDefaultSize();
        browser.manage().timeouts().setScriptTimeout(DEFAULT_TIMEOUT);
    },
    beforeLaunch: function () {
        printBanner();
    },
    jvmArgs: ['-Dwebdriver.gecko.driver=./node_modules/webdriver-manager/selenium/geckodriver-' + seleniumVersions.gecko],
    debug: true
};
