objnest
=====

Convert nested object to flatten or expand.

<!-- Badge start -->

[![Build Status][my_travis_badge_url]][my_travis_url]
[![Code Climate][my_codeclimate_badge_url]][my_codeclimate_url]
[![Code Coverage][my_codeclimate_coverage_badge_url]][my_codeclimate_url]
[![npm version][my_npm_budge_url]][my_npm_url]

Usage
-----

**Flatten object.**
```javascript
var objnest = require('objnest');
var flattened = objnest.flatten({
      'foo': {'bar': 'baz'}
  });
  console.log(flattened); => {'foo.bar': 'baz'}
```

**Expand object.**
```javascript
var objnest = require('objnest');
var expanded = objnest.expand({
   'foo.bar': 'baz'
   });
console.log(expanded); // {foo: {bar: 'baz'}}
```


Installation
-----

```bash
npm install objnest --save
```


License
-------
This software is released under the [MIT License][my_license_url].



<!-- Links start -->

[nodejs_url]: http://nodejs.org/
[npm_url]: https://www.npmjs.com/
[nvm_url]: https://github.com/creationix/nvm
[bitdeli_url]: https://bitdeli.com/free
[my_bitdeli_badge_url]: https://d2weczhvl823v0.cloudfront.net/okunishinishi/node-objnest/trend.png
[my_repo_url]: https://github.com/okunishinishi/node-objnest
[my_travis_url]: http://travis-ci.org/okunishinishi/node-objnest
[my_travis_badge_url]: http://img.shields.io/travis/okunishinishi/node-objnest.svg?style=flat
[my_license_url]: https://github.com/okunishinishi/node-objnest/blob/master/LICENSE
[my_codeclimate_url]: http://codeclimate.com/github/okunishinishi/node-objnest
[my_codeclimate_badge_url]: http://img.shields.io/codeclimate/github/okunishinishi/node-objnest.svg?style=flat
[my_codeclimate_coverage_badge_url]: http://img.shields.io/codeclimate/coverage/github/okunishinishi/node-objnest.svg?style=flat
[my_apiguide_url]: http://okunishinishi.github.io/node-objnest/apiguide
[my_lib_apiguide_url]: http://okunishinishi.github.io/node-objnest/apiguide/module-objnest_lib.html
[my_coverage_url]: http://okunishinishi.github.io/node-objnest/coverage/lcov-report
[my_coverage_report_url]: http://okunishinishi.github.io/node-objnest/coverage/lcov-report/
[my_gratipay_url]: https://gratipay.com/okunishinishi/
[my_gratipay_budge_url]: http://img.shields.io/gratipay/okunishinishi.svg?style=flat
[my_npm_url]: http://www.npmjs.org/package/objnest
[my_npm_budge_url]: http://img.shields.io/npm/v/objnest.svg?style=flat
[my_tag_url]: http://github.com/okunishinishi/node-objnest/releases/tag/
[my_tag_badge_url]: http://img.shields.io/github/tag/okunishinishi/node-objnest.svg?style=flat

<!-- Links end -->
