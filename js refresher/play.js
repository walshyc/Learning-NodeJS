// const name = 'Max';
// let age = 29;
// const hasHobbies = true;

// age = 30;

// const summariseUser = (userName, userAge, userHasHobby) => {
    
//     return ('Name is ' +
//             userName + 
//             ', age is ' + 
//             userAge + 
//             ' and the user has hobbies: ' + 
//             userHasHobby);
// }

// const add = (a,b) =>  a + b;
// const addOne = a => a + 1;
// const addRandom = () => 1 + 2;

// console.log(add(154,26));
// console.log(addOne(2));
// console.log(addRandom());
// console.log(summariseUser(name,age,hasHobbies));

// const person = {
//      name: 'Conor',
//      age: 29,
//      greet()  {
//          console.log('Hi I am ' + this.name);
//      }
//  };
// console.log(person)
// person.greet();

// const printName = (personData) => {
//     console.log(personData.name);
// };

// printName(person);

// const printName = ({ name }) => {
//     console.log(name);
// };

// printName(person);

// const { name, age} = person;
// console.log(name, age);

// const hobbies = ['Sports', 'Cooking'];

// const [hobby1, hobby2] = hobbies;
// console.log(hobby1, hobby2);

// for (let hobby of hobbies) {
//     console.log(hobby);
// }

// console.log(hobbies.map(hobby => 'Hobby: ' + hobby));
// console.log(hobbies);

// hobbies.push('Programming');
// console.log(hobbies);

// const copiedArray = hobbies.slice();
// const copiedArrayTwo = [...hobbies];
// console.log(copiedArray);
// console.log(copiedArrayTwo);

// const toArray = (...args) => {
//     return args;
// };

// console.log(toArray(1,2,3,4));

const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500);
    });
    return promise;
};

setTimeout(() => {
    console.log('Timer is done');
    fetchData().then(text => {
        console.log(text);

    });
}, 2000);