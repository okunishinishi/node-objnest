var objnest = require('objnest');
var expanded = objnest.expand({
    'foo.bar': 'baz'
});
console.log(expanded); // => {foo: {bar: 'baz'}}