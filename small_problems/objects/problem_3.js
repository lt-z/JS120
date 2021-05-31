function objectsEqual(obj1, obj2) {
  let keys1 = Object.keys(obj1).sort();
  let keys2 = Object.keys(obj2).sort();

  for (let key in keys1) {
    if (obj1[keys1[key]] !== obj2[keys2[key]] ||
       keys1.length !== keys2.length) {
      return false;
    }
  }
  return true;
}

console.log(objectsEqual({a: 'foo'}, {a: 'foo'}));                      // true
console.log(objectsEqual({a: 'foo', b: 'bar'}, {a: 'foo', c: 'test', b: 'bar'}));            // false
console.log(objectsEqual({}, {}));                                      // true
console.log(objectsEqual({a: 'foo', b: undefined}, {a: 'foo', c: 1}));  // false