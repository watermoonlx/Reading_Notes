var Mammal = function () {
}

Mammal.prototype.get_name= function () {
    return 'mammal';
}

var Cat = function () {
    this.get_name = function () {
        return 'cat' + '+' + Cat.prototype.get_name();
    }
}

Cat.prototype = new Mammal();

var cat = new Cat();
console.log(cat.get_name());