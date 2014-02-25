# PhantomJS Runner QUnit Plugin #
A PhantomJS-powered headless test runner, providing basic console output for QUnit tests.  

### Usage ###
```bash
  phantomjs runner.js [url-of-your-qunit-testsuite] [timeout-in-seconds]
```

Show test cases:

```bash
  phantomjs runner-list.js [url-of-your-qunit-testsuite] [timeout-in-seconds]
```

### Example ###
```bash
  phantomjs runner.js http://localhost/qunit/test/index.html
```

Show test cases:

```bash
  phantomjs runner-list.js http://localhost/qunit/test/index.html
```

### Notes ###
 - Requires [PhantomJS](http://phantomjs.org/) 1.6+ (1.7+ recommended).
 - QUnit plugins are also available for [gulp](https://github.com/jonkemp/gulp-qunit) and [Grunt](https://github.com/gruntjs/grunt-contrib-qunit).
