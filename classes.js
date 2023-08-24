
class Person {

    #name;
    #age;
    #lastName;
    #hobbies;

    constructor(name, age, lastName, hobbies = []) {
        this.#name = name;
        this.#age = age;
        this.#lastName = lastName;
        this.#hobbies = hobbies;
    }

    getName() {
        return this.#name;
    }

    getAge() {
        return this.#age;
    }

    getLastName() {
        return this.#lastName;
    }

    getHobbies() {
        return this.#hobbies;
    }

    setName(name) {
        this.#name = name;
    }

    setAge(age) {
        this.#age = age;
    }

    setLastName(lastName) {
        this.#lastName = lastName;
    }

    setHobbies(hobbie) {
        this.#hobbies.push(hobbie);
    }

    metodo = () => {

    }
}

class Vehicle {

    #label;
    #color;
    #model;
    
    constructor(label, color, model) {
        this.#label = label;
        this.#color = color;
        this.#model = model;
    }

    getlabel() {
        return this.#label;
    }

    getColor() {
        return this.#color;
    }

    getModel() {
        return this.#model;
    }

    setLabel(label) {
        this.#label = label;
    }

    setColor(color) {
        this.#color = color;
    }

    setModel(model) {
        this.#model = model;
    }

}

class Car extends Vehicle{

    
    
}


const car = new Car("whoknows", "blue", "lamborghini");


console.log(car.getColor());