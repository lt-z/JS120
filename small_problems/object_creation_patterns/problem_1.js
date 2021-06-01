// name property added to make objects easier to identify\

Object.prototype.ancestors = function ancestors() {
  let ancestor = Object.getPrototypeOf(this);

  if (Object.prototype.hasOwnProperty.call(ancestor, 'name')) {
    return [ancestor.name].concat(ancestor.ancestors());
  }
  return ['Object.prototype'];
};

let foo = {name: 'foo'};
console.log(Object.getPrototypeOf(foo));
let bar = Object.create(foo);
bar.name = 'bar';
console.log(Object.hasOwnProperty('name'));

let baz = Object.create(bar);
baz.name = 'baz';
let qux = Object.create(baz);
qux.name = 'qux';


console.log(qux.ancestors());  // returns ['baz', 'bar', 'foo', 'Object.prototype']
console.log(baz.ancestors());  // returns ['bar', 'foo', 'Object.prototype']
console.log(bar.ancestors());  // returns ['foo', 'Object.prototype']
console.log(foo.ancestors());  // returns ['Object.prototype']