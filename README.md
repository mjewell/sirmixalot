# Sir Mix-a-Lot

[![CircleCI](https://circleci.com/gh/mjewell/sirmixalot.svg?style=svg)](https://circleci.com/gh/mjewell/sirmixalot)

Using composition over inheritance has been proposed many times and has been
shown to result in code which is much more flexible to changing requirements.
This library aims to provide some utilities to make alternatives to inheritance
easier than they previously were. For a nice overview of the benefits, check
out [this blog post](http://engineering.appfolio.com/appfolio-engineering/2014/08/20/a-composition-regarding-inheritance).

## Inheritance

For many people, inheritance is the default tool to use when designing complex
systems. Javascript makes inheritance pretty easy now to the point where you
can generally even get away with not knowing that it uses prototypal
inheritance rather than classical inheritance. Here's an example of what
inheritance looks like in ES6:

```js
class Vehicle {
  go() {
    console.log('vroom');
  }
}

class Car extends Vehicle {

}

const car = new Car();
car.go();
// > vroom
```

Unfortunately, inheritance has a few issues which mean it may not be the best
design decision. Firstly, multiple inheritance is not supported in many
languages, including Javascript. Secondly, inheritance enforces that you gain
all of the attributes of the parent class (since Javascript doesn't have real
access modifiers like private/protected/public) when only a few may be needed.
Together, these issues make it hard to structure your classes to optimise reuse
and readability.

## Mixins

Javascript allows you to dynamically create classes using [class expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class).
This can be used to create mixins, which still use inheritance but allow you to
get around some of the issues found in normal inheritance. A mixin in
Javascript might look like this:

```js
function Mixin(superclass = class {}) {
  return class extends superclass {
    go() {
      console.log('vroom');
    }
  }
}

class Car extends Mixin() {

}

const car = new Car();
car.go();
// > vroom
```

This library provides the `mix` function which can be used with mixins defined
as subclass factories to create a new inheritance chain. The mix function is
called like this:

```
class SubClass extends mix([Mixin1, Mixin2, Mixin3], SuperClass) {

}
```

And creates a prototype chain that looks like this:

`SubClass` -> `Mixin1` -> `Mixin2` -> `Mixin3` -> `SuperClass`

## Delegation

Delegation is a tool that makes composition easier to use because it removes a
lot of the boilerplate that would otherwise need to be written. Delegation
creates new methods which are proxies to methods on an object held by the
delegating class. An example of delegation looks like this:

```js
class Vehicle {
  go() {
    console.log('vroom');
  }
}

class Car {
  this.vehicle = new Vehicle();
}

delegate(Car, 'vehicle', ['go']);

const car = new Car();
car.go();
// > vroom
```

In this case, the `Car` class holds a reference to a vehicle instance, and the
`delegate` function creates a new `go` method on the car class which calls
`this.vehicle.go()`. Delegation allows you to avoid the use of inheritance
entirely, giving much more flexibility.
