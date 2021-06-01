let franchise = {
  name: 'How to Train Your Dragon',

  allMovies: function() {
    return [1, 2, 3].map(function(number) {
      return this.name + ' ' + number;
    }.bind(this));
  },
};


console.log(franchise.allMovies());
/*
hard-bound anonymous function to map
arrow function is 
[
  'How to Train Your Dragon 1',
  'How to Train Your Dragon 2',
  'How to Train Your Dragon 3'
]
*/