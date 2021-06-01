// Read the following code carefully. What do you think is logged on line 11.
// Try to answer the question before you run the code.


let person = {
  firstName: 'Rick ',
  lastName: 'Sanchez',
  fullName: this.firstName + this.lastName,

  // fullName: function() {
  //   return this.firstName + this.lastName;
  // }
};

console.log(person.fullName);

let person1 = person.fullName;
console.log(person1());
/*

*/