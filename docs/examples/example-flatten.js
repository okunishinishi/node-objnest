var objnest = require('objnest');
var flattened = objnest.flatten({
    'foo': {'bar': 'baz'}
});
console.log(flattened); // => {'foo.bar': 'baz'}