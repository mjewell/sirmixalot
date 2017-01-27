import { delegate } from '../src';
import * as assert from 'assert';
import 'mocha';

describe('delegate', () => {
  class Delegatee {
    public x = 1;

    public doSomething() {
      return this.x;
    }

    public setSomething(x: number) {
      this.x = x;
    }
  }

  interface IDelegatee {
    x: number;
    doSomething(): number;
    setSomething(x: number): void;
  }

  interface IDelegator {
    delegatee: IDelegatee;
  }

  describe('class to class', () => {
    it('should delegate methods', () => {
      class Delegator {
        public delegatee = new Delegatee();
      }

      delegate(Delegator, 'delegatee', ['doSomething']);

      type ExtendedDelegator = Delegator & { doSomething(): number };

      const delegator = new Delegator() as ExtendedDelegator;

      assert.equal(delegator.doSomething(), 1);
    });

    it('should delegate properties', () => {
      class Delegator {
        public delegatee = new Delegatee();
      }

      delegate(Delegator, 'delegatee', ['x']);

      type ExtendedDelegator = Delegator & { x: number };

      const delegator = new Delegator() as ExtendedDelegator;

      assert.equal(delegator.x, 1);
    });
  });

  describe('object to class', () => {
    const delegatee: IDelegatee = {
      x: 1,
      doSomething() {
        return this.x;
      },
      setSomething(x: number) {
        this.x = x;
      }
    };

    it('should delegate methods', () => {
      class Delegator {
        public delegatee = new Delegatee();
      }

      delegate(Delegator, 'delegatee', ['doSomething']);

      type ExtendedDelegator = Delegator & { doSomething(): number };

      const delegator = new Delegator() as ExtendedDelegator;

      assert.equal(delegator.doSomething(), 1);
    });

    it('should delegate properties', () => {
      class Delegator {
        public delegatee = new Delegatee();
      }

      delegate(Delegator, 'delegatee', ['x']);

      type ExtendedDelegator = Delegator & { x: number };

      const delegator = new Delegator() as ExtendedDelegator;

      assert.equal(delegator.x, 1);
    });
  });

  describe('class to object', () => {
    it('should delegate methods', () => {
      const delegator = {
        delegatee: new Delegatee()
      };

      delegate(delegator, 'delegatee', ['doSomething']);

      const extendedDelegator = delegator as IDelegator & { doSomething(): number };

      assert.equal(extendedDelegator.doSomething(), 1);
    });

    it('should delegate properties', () => {
      const delegator = Object.create({
        delegatee: new Delegatee()
      });

      delegate(delegator, 'delegatee', ['x']);

      const extendedDelegator = delegator as IDelegator & { x: number };

      assert.equal(extendedDelegator.x, 1);
    });
  });

  describe('object to object', () => {
    const delegatee: IDelegatee = {
      x: 1,
      doSomething() {
        return this.x;
      },
      setSomething(x: number) {
        this.x = x;
      }
    };

    it('should delegate methods', () => {
      const delegator = {
        delegatee
      };

      delegate(delegator, 'delegatee', ['doSomething']);

      const extendedDelegator = delegator as IDelegator & { doSomething(): number };

      assert.equal(extendedDelegator.doSomething(), 1);
    });

    it('should delegate properties', () => {
      const delegator = Object.create({
        delegatee
      });

      delegate(delegator, 'delegatee', ['x']);

      const extendedDelegator = delegator as IDelegator & { x: number };

      assert.equal(extendedDelegator.x, 1);
    });
  });

  it('should delegate all properties listed', () => {
    class Delegator {
      public delegatee = new Delegatee();
    }

    delegate(Delegator, 'delegatee', ['x', 'doSomething', 'setSomething']);

    type ExtendedDelegator = Delegator & IDelegatee;

    const delegator = new Delegator() as ExtendedDelegator;

    assert.equal(delegator.x, 1);
    assert.equal(delegator.doSomething(), 1);
    delegator.setSomething(2);
    assert.equal(delegator.x, 2);
    assert.equal(delegator.doSomething(), 2);
  });

  describe('when a property is already defined on the object', () => {
    it('should error by default', () => {
      class Delegator {
        public delegatee = new Delegatee();

        public doSomething() {
          return 'a';
        }
      }

      assert.throws(
        () => { delegate(Delegator, 'delegatee', ['doSomething']); },
        (err: any) => err.message === `Property 'doSomething' is already defined on Delegator`,
        'Expected delegate to throw when the method is defined'
      );

      assert.throws(() => {
        delegate(Delegator, 'delegatee', ['doSomething']);
      }, 'Expected delegate to throw when the method is defined');

      const delegator = new Delegator();

      assert.equal(delegator.doSomething(), 'a');
    });

    it('should error when the overwrite option is false', () => {
      class Delegator {
        public delegatee = new Delegatee();

        public doSomething() {
          return 'a';
        }
      }

      assert.throws(
        () => { delegate(Delegator, 'delegatee', ['doSomething'], { overwrite: false }); },
        (err: any) => err.message === `Property 'doSomething' is already defined on Delegator`,
        'Expected delegate to throw when the method is defined'
      );

      const delegator = new Delegator();

      assert.equal(delegator.doSomething(), 'a');
    });

    it('should overwrite when the overwrite option is true', () => {
      class Delegator {
        public delegatee = new Delegatee();

        public doSomething() {
          return 'a';
        }
      }

      delegate(Delegator, 'delegatee', ['doSomething'], { overwrite: true });

      type ExtendedDelegator = Delegator & { doSomething(): number };

      const delegator = new Delegator() as ExtendedDelegator;

      assert.equal(delegator.doSomething(), 1);
    });
  });

  it(`correctly binds 'this' to the delegated object`, () => {
    class Delegator {
      public delegatee = new Delegatee();
      public x = 0;
    }

    delegate(Delegator, 'delegatee', ['doSomething']);

    type ExtendedDelegator = Delegator & { doSomething(): number };

    const delegator = new Delegator() as ExtendedDelegator;

    assert.equal(delegator.doSomething(), 1);
    assert.equal(delegator.x, 0);
  });
});
