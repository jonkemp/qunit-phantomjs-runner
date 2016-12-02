/*global phantom:false, require:false, console:false, window:false, QUnit:false */

(function () {
    'use strict';

    var url, page, timeout,
        args = require('system').args;

    // arg[0]: scriptName, args[1...]: arguments
    if (args.length < 2) {
        console.error('Usage:\n  phantomjs [phantom arguments] runner-xml.js [url-of-your-qunit-testsuite] [timeout-in-seconds] [page-properties]');
        exit(1);
    }

    url = args[1];

    if (args[2] !== undefined) {
        timeout = parseInt(args[2], 10);
    }

    page = require('webpage').create();

    if (args[3] !== undefined) {
        try {
            var pageProperties = JSON.parse(args[3]);

            if (pageProperties) {
                for (var prop in pageProperties) {
                    if (pageProperties.hasOwnProperty(prop)) {
                        page[prop] = pageProperties[prop];
                    }
                }
            }
        } catch (e) {
            console.error('Error parsing "' + args[3] + '": ' + e);
        }
    }

    // Route `console.log()` calls from within the Page context to the main Phantom context (i.e. current `this`)
    page.onConsoleMessage = function (msg) {
        console.log(msg);
    };

    page.onInitialized = function () {
        page.evaluate(addLogging);
    };

    page.onCallback = function (message) {
        var result,
            failed;

        if (message) {
            if (message.name === 'QUnit.done') {
                result = message.data;
                failed = !result || !result.total || result.failed;

                if (!result.total) {
                    console.error('No tests were executed. Are you loading tests asynchronously?');
                }

                exit(failed ? 1 : 0);
            }
        }
    };

    page.open(url, function (status) {
        if (status !== 'success') {
            console.error('Unable to access network: ' + status);
            exit(1);
        } else {
            // Cannot do this verification with the 'DOMContentLoaded' handler because it
            // will be too late to attach it if a page does not have any script tags.
            var qunitMissing = page.evaluate(function () {
                return (typeof QUnit === 'undefined' || !QUnit);
            });
            if (qunitMissing) {
                console.error('The `QUnit` object is not present on this page.');
                exit(1);
            }

            // Set a default timeout value if the user does not provide one
            if (typeof timeout === 'undefined') {
                timeout = 5;
            }

            if (page.injectJs('./node_modules/qunit-reporter-junit/qunit-reporter-junit.js') === false) {
                console.error('Could not inject `qunit-reporter-junit.js`.');
                exit(1);
            }

            // Override default
            page.evaluate(function () {
                QUnit.jUnitReport = function (report) {
                    console.log(report.xml);
                };
            });

            // Set a timeout on the test running, otherwise tests with async problems will hang forever
            setTimeout(function () {
                console.error('The specified timeout of ' + timeout + ' seconds has expired. Aborting...');
                exit(1);
            }, timeout * 1000);

            // Do nothing... the callback mechanism will handle everything!
        }
    });

    function addLogging() {
        window.document.addEventListener('DOMContentLoaded', function () {

            QUnit.done(function (result) {
                if (typeof window.callPhantom === 'function') {
                    window.callPhantom({
                        'name': 'QUnit.done',
                        'data': result
                    });
                }
            });

        }, false);
    }

    function exit(code) {
        if (page) {
            page.close();
        }
        setTimeout(function () {
            phantom.exit(code);
        }, 0);
    }
})();
