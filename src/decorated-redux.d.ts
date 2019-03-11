import { Action, AnyAction } from 'redux';

declare module 'redux' {
  export interface Dispatch<A extends Action = AnyAction> {
    <T extends A>(action: T): T;
    <T extends A[]>(action: T): T;
  }
}
