# PhantomJS Runner QUnit Plugin [![Build Status](https://travis-ci.org/jonkemp/qunit-phantomjs-runner.png?branch=master)](https://travis-ci.org/jonkemp/qunit-phantomjs-runner)

> A PhantomJS-powered headless test runner, providing basic console output for QUnit tests.

The runner requires [PhantomJS](http://phantomjs.org/). If you don't want to deal with installing PhantomJS or using Grunt to run your tests, try [node-qunit-phantomjs](https://github.com/jonkemp/node-qunit-phantomjs).

## Installation
```bash
$ npm install qunit-phantomjs-runner
```

## Usage
```bash
$ phantomjs path/to/runner.js [url-of-your-qunit-testsuite]
```

With options:

```bash
$ phantomjs [phantom arguments] path/to/runner.js [url-of-your-qunit-testsuite] [timeout-in-seconds]
```

Show test cases:

```bash
$ phantomjs path/to/runner-list.js [url-of-your-qunit-testsuite]
```
## Use with jUnit and write an result.xml file
In that case to output a xml file for the testresults, it's possible to load the QUnit Plugin [https://github.com/JamesMGreene/qunit-reporter-junit] and write at the top of you QUnit HTML File:

```html
<script>
    if (typeof window.callPhantom === 'function') {
        window.callPhantom({jUnitReportFile: 'test1.xml'});
    }
</script>
```

after that, a "test1.xml" file will be written in you root directory.

## Timeout
In `v2.0`, a default timeout of 5 seconds was added. The timeout was optional before. This could cause tests to break, which is the reason for the major version bump.

## Notes
 - Requires [PhantomJS](http://phantomjs.org/) 1.6+ (1.7+ recommended).
 - QUnit plugins are also available for [gulp](https://github.com/jonkemp/gulp-qunit) and [Grunt](https://github.com/gruntjs/grunt-contrib-qunit).

## License 

The MIT License

Copyright (c) 2014, Jonathan Kemp
