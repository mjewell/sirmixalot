export type IConstructable<T> = new () => T;

export interface IMixin<S extends IConstructable<{}>, T extends IConstructable<{}>> {
  (superclass: S): T;
}

export function mix(mixins: IMixin<any, any>[], superclass: IConstructable<any> = class { }) {
  return mixins.reverse().reduce((prev, curr) => curr(prev), superclass);
}
