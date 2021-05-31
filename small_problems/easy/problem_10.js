class Pet {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }

  info () {
    return `a ${this.type} named ${this.name}`;
  }
}

class Owner {
  constructor(name) {
    this.name = name;
    this.petList = [];
  }

  numberOfPets() {
    return this.petList.length;
  }

  addPet(pet) {
    this.petList.push(pet);
  }

  printPets() {
    this.petList.forEach(pet => console.log(pet.info()));
  }
}

class Shelter {
  constructor() {
    this.owners = {};
    this.unadoptedList = [];
  }

  adopt(owner, pet) {
    owner.addPet(pet);
    if (this.unadoptedList.includes(pet)) {
      this.removeFromShelter(pet);
    }
    if (!this.owners[owner.name]) {
      this.owners[owner.name] = owner;
    }
  }

  printAdoptions() {
    for (let owner in this.owners) {
      console.log(`${owner} has adopted the following pets:`);
      this.owners[owner].printPets();
      console.log();
    }
  }

  numberInShelter() {
    return this.unadoptedList.length;
  }

  printNumInShelter() {
    console.log(`The Animal shelter has ${this.numberInShelter()} unadopted pets.`);
  }

  addToShelter(pet) {
    this.unadoptedList.push(pet);
  }

  removeFromShelter(pet) {
    this.unadoptedList.splice(this.unadoptedList.indexOf(pet), 1);
  }
}


let butterscotch = new Pet('cat', 'Butterscotch');
let pudding      = new Pet('cat', 'Pudding');
let darwin       = new Pet('bearded dragon', 'Darwin');
let kennedy      = new Pet('dog', 'Kennedy');
let sweetie      = new Pet('parakeet', 'Sweetie Pie');
let molly        = new Pet('dog', 'Molly');
let chester      = new Pet('fish', 'Chester');

let phanson = new Owner('P Hanson');
let bholmes = new Owner('B Holmes');

let shelter = new Shelter();
shelter.adopt(phanson, butterscotch);
shelter.adopt(phanson, pudding);
shelter.adopt(phanson, darwin);
shelter.adopt(bholmes, kennedy);
shelter.adopt(bholmes, sweetie);
shelter.adopt(bholmes, molly);
shelter.adopt(bholmes, chester);
shelter.printAdoptions();
console.log(`${phanson.name} has ${phanson.numberOfPets()} adopted pets.`);
console.log(`${bholmes.name} has ${bholmes.numberOfPets()} adopted pets.`);

/*
P Hanson has adopted the following pets:
a cat named Butterscotch
a cat named Pudding
a bearded dragon named Darwin

B Holmes has adopted the following pets:
a dog named Molly
a parakeet named Sweetie Pie
a dog named Kennedy
a fish named Chester

P Hanson has 3 adopted pets.
B Holmes has 4 adopted pets.
*/

let asta = new Pet('cat', 'Asta');
let laddie = new Pet('cat', 'Laddie');
let fluffy = new Pet('cat', 'Fluffy');
let kat = new Pet('cat', 'Kat');
let ben = new Pet('cat', 'Ben');
let chatterbox = new Pet('parakeet', 'Chatterbox');
let bluebell = new Pet('parakeet', 'Bluebell');

shelter.addToShelter(asta);
shelter.addToShelter(laddie);
shelter.addToShelter(fluffy);
shelter.addToShelter(kat);
shelter.addToShelter(ben);
shelter.addToShelter(chatterbox);
shelter.addToShelter(bluebell);

shelter.printNumInShelter();
shelter.adopt(phanson, fluffy);
shelter.printNumInShelter();
