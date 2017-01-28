# Intelligent Design

Your code should be best explained by an intelligent cause, not an undirected
process. Inheritance isn't going to make your code-base evolve well. Great code
arises from... `intelligent-design`.

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

```
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

## Mixins

## Delegation

