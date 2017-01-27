export interface IDelegationDescriptorObject {
  [key: string]: string;
}

export type IDelegationDescriptor = IDelegationDescriptorObject | string;

function getPropNames(delegationDescriptor: IDelegationDescriptor) {
  if (typeof delegationDescriptor === 'object') {
    const fromPropName = Object.keys(delegationDescriptor)[0];
    return {
      fromPropName,
      toPropName: delegationDescriptor[fromPropName]
    };
  }

  return {
    fromPropName: delegationDescriptor,
    toPropName: delegationDescriptor
  };
}

function createDelegateMethodPropertyDescriptor(delegateePropName: string, propName: string) {
  return {
    get() {
      const delegatee = this[delegateePropName];

      if (typeof delegatee[propName] === 'function') {
        return (...args: any[]) => delegatee[propName](...args);
      }

      return delegatee[propName];
    }
  };
}

function addDelegateMethod(receiver: any, delegateePropName: string, toPropName: string, fromPropName: string) {
  Object.defineProperty(
    receiver,
    toPropName,
    createDelegateMethodPropertyDescriptor(delegateePropName, fromPropName)
  );
}

export interface IDelegateOptions {
  overwrite?: boolean;
}

export function delegate(
  delegator: any,
  delegateePropName: string,
  propDescriptors: IDelegationDescriptor[],
  options: IDelegateOptions = {}
) {
  propDescriptors.forEach(propDescriptor => {
    const { fromPropName, toPropName } = getPropNames(propDescriptor);

    const receiver = delegator.prototype ? delegator.prototype : delegator;

    if (!options.overwrite && receiver.hasOwnProperty(toPropName)) {
      throw new Error(`Property '${toPropName}' is already defined on ${delegator.name}`);
    }

    addDelegateMethod(receiver, delegateePropName, toPropName, fromPropName);
  });
}
