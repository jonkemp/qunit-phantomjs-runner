/* eslint-disable */
/* global describe, it */

'use strict';

var assert = require('assert'),
    out = process.stdout.write.bind(process.stdout),
    qunit = function (filepath, runner) {
        var path = require('path'),
            childProcess = require('child_process'),
            phantomjs = require('phantomjs-prebuilt'),
            binPath = phantomjs.path,
            args = Array.prototype.slice.call(arguments);

        if (!runner) {
            runner = '../runner.js';
        }

        var childArgs = [ path.join(__dirname, runner) ];

        if (filepath) {
            childArgs.push( filepath );
        }

        // Optional timeout value
        if ( args[2] ) {
            childArgs.push( args[2] );
        }

        // Optional phantomjs options value
        if ( args[3] ) {
            childArgs.unshift( args[3] );
        }

        // Optional page properties value
        if ( args[4] ) {
            childArgs.push( args[4] );
        }

        childProcess.execFile(binPath, childArgs, function (err, stdout, stderr) {
            if (stdout) {
                stdout = stdout.trim(); // Trim trailing cr-lf
                console.log(stdout);
            }

            if (stderr) {
                console.log(stderr);
            }

            /*if (err) {
                console.log(err);
            }*/
        });
    },
    pageProperties = JSON.stringify({
        viewportSize: {
            width: 1000,
            height: 1000
        }
    });

describe('qunit-phantomjs-runner runner.js', function () {
    this.timeout(10000);

    it('tests should pass', function (cb) {

        qunit('test/fixtures/passing.html');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/10 passed. 0 failed./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('tests should fail', function (cb) {

        qunit('test/fixtures/failing.html');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/9 passed. 1 failed./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should error on incorrect number of arguments', function (cb) {

        qunit();

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Usage:\r?\n  phantomjs \[phantom arguments\] runner.js \[url-of-your-qunit-testsuite\] \[timeout-in-seconds\]/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    xit('should error on no tests', function (cb) {

        qunit('test/fixtures/no-tests.html');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Error: No tests were run./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should error when QUnit not found', function (cb) {

        qunit('test/fixtures/no-qunit.html');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The `QUnit` object is not present on this page./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should time out', function (cb) {

        qunit('test/fixtures/async.html', '../runner.js', 1);

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The specified timeout of 1 seconds has expired. Aborting.../.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should show unable to access network', function (cb) {

        qunit('test/fixtures/not-found.html');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Unable to access network:/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should pass options to phantomjs', function (cb) {

        qunit('test/fixtures/passing.html', '../runner.js', 5, '--help');

        process.stdout.write = function (str) {
            var lines = str.split('\n');

            for (var i = 0, length = lines.length; i < length; i++) {
                if (/.*--help.*Shows this message and quits/.test(lines[i])) {
                    assert(true);
                    process.stdout.write = out;
                    cb();
                }
            }
        };
    });

    it('should set custom viewport', function (cb) {

        qunit('test/fixtures/custom-viewport.html', '../runner.js', 5, '', pageProperties);

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/1 passed. 0 failed./.test(str));
            process.stdout.write = out;
            cb();
        };
    });
});

describe('qunit-phantomjs-runner runner-list.js', function () {
    this.timeout(10000);

    it('tests should pass', function (cb) {

        qunit('test/fixtures/passing.html', '../runner-list.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/10 passed. 0 failed./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('tests should fail', function (cb) {

        qunit('test/fixtures/failing.html', '../runner-list.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/9 passed. 1 failed./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    xit('should error on no tests', function (cb) {

        qunit('test/fixtures/no-tests.html', '../runner-list.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Error: No tests were run./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should error when QUnit not found', function (cb) {

        qunit('test/fixtures/no-qunit.html', '../runner-list.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The `QUnit` object is not present on this page./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should time out', function (cb) {

        qunit('test/fixtures/async.html', '../runner-list.js', 1);

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The specified timeout of 1 seconds has expired. Aborting.../.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should show unable to access network', function (cb) {

        qunit('test/fixtures/not-found.html', '../runner-list.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Unable to access network:/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should set custom viewport', function (cb) {

        qunit('test/fixtures/custom-viewport.html', '../runner-list.js', 5, '', pageProperties);

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/1 passed. 0 failed./.test(str));
            process.stdout.write = out;
            cb();
        };
    });
});

describe('qunit-phantomjs-runner runner-json.js', function () {
    this.timeout(10000);

    it('tests should pass', function (cb) {

        qunit('test/fixtures/passing.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/"passed":10,"failed":0,"total":10/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('tests should fail', function (cb) {

        qunit('test/fixtures/failing.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/"passed":9,"failed":1,"total":10/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    xit('should error on no tests', function (cb) {

        qunit('test/fixtures/no-tests.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Error: No tests were run./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should error when QUnit not found', function (cb) {

        qunit('test/fixtures/no-qunit.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The `QUnit` object is not present on this page./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should time out', function (cb) {

        qunit('test/fixtures/async.html', '../runner-json.js', 1);

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The specified timeout of 1 seconds has expired. Aborting.../.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should show unable to access network', function (cb) {

        qunit('test/fixtures/not-found.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Unable to access network:/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should set custom viewport', function (cb) {

        qunit('test/fixtures/custom-viewport.html', '../runner-json.js', 5, '', pageProperties);

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/"passed":1,"failed":0,"total":1/.test(str));
            process.stdout.write = out;
            cb();
        };
    });
});

describe('qunit-phantomjs-runner runner-xml.js', function () {
    this.timeout(10000);

    it('tests should pass', function (cb) {

        qunit('test/fixtures/passing.html', '../runner-xml.js');

        process.stdout.write = function (str) {
            //out(str);

            process.stdout.write = out;
            require('xml2js').parseString(str, function (err, result) {
                assert.equal(result.testsuites.$.tests, 10);
                assert.equal(result.testsuites.$.failures, 0);
                assert.equal(result.testsuites.$.errors, 0);
                cb();
            });
        };
    });

    it('tests should fail', function (cb) {

        qunit('test/fixtures/failing.html', '../runner-xml.js');

        process.stdout.write = function (str) {
            //out(str);

            process.stdout.write = out;
            require('xml2js').parseString(str, function (err, result) {
                assert.equal(result.testsuites.$.tests, 10);
                assert.equal(result.testsuites.$.failures, 1);
                assert.equal(result.testsuites.$.errors, 0);
                cb();
            });
        };
    });

    xit('should error on no tests', function (cb) {

        qunit('test/fixtures/no-tests.html', '../runner-xml.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Error: No tests were run./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should error when QUnit not found', function (cb) {

        qunit('test/fixtures/no-qunit.html', '../runner-xml.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The `QUnit` object is not present on this page./.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should time out', function (cb) {

        qunit('test/fixtures/async.html', '../runner-xml.js', 1);

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/The specified timeout of 1 seconds has expired. Aborting.../.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should show unable to access network', function (cb) {

        qunit('test/fixtures/not-found.html', '../runner-xml.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/Unable to access network:/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should set custom viewport', function (cb) {

        qunit('test/fixtures/custom-viewport.html', '../runner-xml.js', 5, '', pageProperties);

        process.stdout.write = function (str) {
            //out(str);

            process.stdout.write = out;
            require('xml2js').parseString(str, function (err, result) {
                assert(result.testsuites.$.tests, 1);
                assert(result.testsuites.$.failures, 0);
                assert(result.testsuites.$.errors, 0);
                cb();
            });
        };
    });
});
