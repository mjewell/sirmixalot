import { IConstructable, mix } from '../src';
import * as assert from 'assert';
import 'mocha';

interface ISuperable {
  superAwesome(): string;
}

describe('mix', () => {
  function Startable(superclass: IConstructable<Object>) {
    return class extends superclass {
      public start() {
        return 'vroom';
      }
    };
  }

  function Stoppable(superclass: IConstructable<Object>) {
    return class extends superclass {
      public stop() {
        return 'screech';
      }
    };
  }

  function Superable1(superclass: IConstructable<ISuperable>) {
    return class extends superclass {
      public superAwesome() {
        return `Superable1`;
      }
    };
  }

  function Superable2(superclass: IConstructable<ISuperable>) {
    return class extends superclass {
      public superAwesome() {
        return `${super.superAwesome()} -> Superable2`;
      }
    };
  }

  function Superable3(superclass: IConstructable<ISuperable>) {
    return class extends superclass {
      public superAwesome() {
        return `${super.superAwesome()} -> Superable3`;
      }
    };
  }

  function Constructable(superclass: IConstructable<Object>) {
    return class extends superclass {
      public constructableProperty: string;

      constructor() {
        super();
        this.constructableProperty = 'set in constructor';
      }
    };
  }

  describe('with no superclass', () => {
    it('should apply a mixin', () => {
      const Car = mix([Startable]);
      const car = new Car();
      assert.equal(car.start(), 'vroom');
    });

    it('should apply multiple mixins', () => {
      const Car = mix([Startable, Stoppable]);
      const car = new Car();
      assert.equal(car.start(), 'vroom');
      assert.equal(car.stop(), 'screech');
    });

    it('should work correctly with super', () => {
      const Car = mix([Superable3, Superable2, Superable1]);
      const car = new Car();
      assert.equal(car.superAwesome(), 'Superable1 -> Superable2 -> Superable3');
    });

    it('should work correctly with constructors', () => {
      const Car = mix([Constructable]);
      const car = new Car();
      assert.equal(car.constructableProperty, 'set in constructor');
    });
  });

  describe('with a superclass', () => {
    class Vehicle {
      public vehicleConstructableProperty: string;

      constructor() {
        this.vehicleConstructableProperty = 'set in constructor';
      }

      public move() {
        return 'moving';
      }
    }

    it('should apply a mixin', () => {
      const Car = mix([Startable], Vehicle);
      const car = new Car();
      assert.equal(car.move(), 'moving');
      assert.equal(car.start(), 'vroom');
    });

    it('should apply multiple mixins', () => {
      const Car = mix([Startable, Stoppable], Vehicle);
      const car = new Car();
      assert.equal(car.move(), 'moving');
      assert.equal(car.start(), 'vroom');
      assert.equal(car.stop(), 'screech');
    });

    it('should work correctly with super', () => {
      const Car = mix([Superable3, Superable2, Superable1], Vehicle);
      const car = new Car();
      assert.equal(car.move(), 'moving');
      assert.equal(car.superAwesome(), 'Superable1 -> Superable2 -> Superable3');
    });

    it('should work correctly with constructors', () => {
      const Car = mix([Constructable], Vehicle);
      const car = new Car();
      assert.equal(car.move(), 'moving');
      assert.equal(car.vehicleConstructableProperty, 'set in constructor');
      assert.equal(car.constructableProperty, 'set in constructor');
    });
  });
});
