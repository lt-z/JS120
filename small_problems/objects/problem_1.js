/* eslint-disable max-lines-per-function */
function createGreeter(name) {
  return {
    name: name,
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',

    greet: function(timeOfDay) {
      let msg = '';
      switch (timeOfDay) {
        case 'morning':
          msg += `${this.morning} ${name}`;
          break;
        case 'afternoon':
          msg += `${this.afternoon} ${name}`;
          break;
        case 'evening':
          msg += `${this.evening} ${name}`;
          break;
      }

      console.log(msg);
    },
  };
}

let helloVictor = createGreeter('Victor');
helloVictor.greet('morning');
helloVictor.name = 'Vic';
helloVictor.greet('morning');
// Good Morning Victor

/*
The above `name` variable works because it uses the argument value of
`name` rather than the `this.name` instance property. The issue here is that
if the `this.name` instance property is changed, it will NOT change
the `greet` instance method's `name` variable.
*/