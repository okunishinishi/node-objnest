var objnest = require('objnest');
var expanded = objnest.expand({
    'foo.bar[0]': 'baz0',
    'foo.bar[1]': 'baz1'
});
console.log(expanded); // => {foo: bar:['baz0', 'baz1']}}