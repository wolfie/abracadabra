import { values, pipe, map, all } from 'ramda';
import { isArray } from 'util';

export interface ManaPool {
  r: number;
  g: number;
  b: number;
  u: number;
  w: number;
  c: number;
}

export interface Ability {
  cost: Cost;
}

export interface Card {
  name: string;
  id: number;
  abilities: Ability[];
}

export interface Permanent extends Card {
  isTapped: boolean;
}

export interface Cost {
  r: number;
  g: number;
  b: number;
  u: number;
  w: number;
  c: number;
  taps: number[];
}

export namespace Cost {
  export const Empty: Cost = {
    w: 0,
    u: 0,
    b: 0,
    r: 0,
    g: 0,
    c: 0,
    taps: []
  };

  const isDebtFree = (entry: number | number[]) =>
    isArray(entry) ? entry.length === 0 : entry === 0;

  export const isEmpty = pipe(
    values,
    map(isDebtFree),
    all(debtFree => debtFree === true)
  );
}

export interface GameState {
  manaPool: ManaPool;
  health: number;
  hand: Card[];
  board: Permanent[];
  deck: Card[];
  graveyard: Card[];
  nextCardId: number;
  costsOwed: Cost;
}

export const TAP_PERMANENT = 'TAP_PERMANENT';
interface TapAction {
  type: typeof TAP_PERMANENT;
  id: number;
}

export const ENTER_PERMANENT_TO_BATTLEFIELD = 'ENTER_PERMANENT_TO_BATTLEFIELD';
interface EnterPermanentToBattlefieldAction {
  type: typeof ENTER_PERMANENT_TO_BATTLEFIELD;
  permanent: Permanent;
}

export const ACTIVATE_ABILITY = 'ACTIVATE_ABILITY';
interface ActivateAbilityAction {
  type: typeof ACTIVATE_ABILITY;
  permanentId: number;
  abilityId: number;
}

export type GameStateActions =
  | TapAction
  | EnterPermanentToBattlefieldAction
  | ActivateAbilityAction;
