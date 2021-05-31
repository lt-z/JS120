/*
Using the code from the previous exercise, move the greeting from the
constructor method to an instance method named greet that logs a
greeting to the console when invoked.
*/

class Person {
  constructor(name = 'John Doe') {
    this.name = name;
  }
}

let person1 = new Person();
let person2 = new Person("Pepe");

console.log(person1.name); // John Doe
console.log(person2.name); // Pepe