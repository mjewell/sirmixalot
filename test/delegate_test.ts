import { delegate } from '../src';
import * as assert from 'assert';
import 'mocha';

describe('delegate', () => {
  describe('class to class', () => {
    class Delegatee {
      public x: number;

      constructor() {
        this.x = 1;
      }

      public doSomething() {
        return this.x;
      }
    }

    it('should delegate methods from one class to another', () => {
      class Delegator {
        private delegatee: Delegatee;

        constructor() {
          this.delegatee = new Delegatee();
        }
      }

      delegate(Delegator, 'delegatee', ['doSomething']);

      type ExtendedDelegator = Delegator & { doSomething(): number };

      const delegator = new Delegator() as ExtendedDelegator;

      assert.equal(typeof delegator.doSomething, 'function');
      assert.equal(delegator.doSomething(), 1);
    });
  });
});
