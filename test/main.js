/* jshint node: true */
/* global describe, it */

'use strict';

var assert = require('assert'),
    out = process.stdout.write.bind(process.stdout),
    qunit = function (filepath, runner) {
        var path = require('path'),
            childProcess = require('child_process'),
            phantomjs = require('phantomjs'),
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
    };

describe('qunit-phantomjs-runner runner.js', function () {
    this.timeout(5000);

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

            assert.ok(/Usage:\n  phantomjs \[phantom arguments\] runner.js \[url-of-your-qunit-testsuite\] \[timeout-in-seconds\]/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should error on no tests', function (cb) {

        qunit('test/fixtures/no-tests.html');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/No tests were executed. Are you loading tests asynchronously?/.test(str));
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
        this.timeout(10000);

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
});

describe('qunit-phantomjs-runner runner-list.js', function () {
    this.timeout(5000);

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

    it('should error on no tests', function (cb) {

        qunit('test/fixtures/no-tests.html', '../runner-list.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/No tests were executed. Are you loading tests asynchronously?/.test(str));
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
        this.timeout(10000);

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
});

describe('qunit-phantomjs-runner runner-json.js', function () {
    this.timeout(5000);

    it('tests should pass', function (cb) {

        qunit('test/fixtures/passing.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/"failed":0,"passed":10,"total":10/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('tests should fail', function (cb) {

        qunit('test/fixtures/failing.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/"failed":1,"passed":9,"total":10/.test(str));
            process.stdout.write = out;
            cb();
        };
    });

    it('should error on no tests', function (cb) {

        qunit('test/fixtures/no-tests.html', '../runner-json.js');

        process.stdout.write = function (str) {
            //out(str);

            assert.ok(/No tests were executed. Are you loading tests asynchronously?/.test(str));
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
        this.timeout(10000);

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
});
