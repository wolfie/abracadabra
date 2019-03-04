import { values, pipe, map, all, any } from "ramda";
import { isBoolean } from "util";
import path from "ramda/es/path";

export type ManaPool = {
  r: number;
  g: number;
  b: number;
  u: number;
  w: number;
  c: number;
};

export namespace ManaPool {
  export const Empty: ManaPool = {
    r: 0,
    g: 0,
    b: 0,
    u: 0,
    w: 0,
    c: 0
  };

  export const Add = (
    manaPool: ManaPool,
    addition: Partial<ManaPool>
  ): ManaPool => ({
    r: manaPool.r + (addition.r || 0),
    g: manaPool.g + (addition.g || 0),
    b: manaPool.b + (addition.b || 0),
    u: manaPool.u + (addition.u || 0),
    w: manaPool.w + (addition.w || 0),
    c: manaPool.c + (addition.c || 0)
  });
}

export type Card = {
  name: string;
  id: number;
  abilities: Ability[];
};

export type Permanent = Card & {
  isTapped: boolean;
};

export type ActivationCost = {
  r: number;
  g: number;
  b: number;
  u: number;
  w: number;
  c: number;
  tapSelf: boolean;
};

export namespace ActivationCost {
  export const Empty: ActivationCost = {
    w: 0,
    u: 0,
    b: 0,
    r: 0,
    g: 0,
    c: 0,
    tapSelf: false
  };

  const isDebtFree = (entry: ValueOf<ActivationCost>) =>
    isBoolean(entry) ? !entry : entry === 0;

  export const isEmpty: (cost: ActivationCost) => boolean = pipe(
    values,
    map(isDebtFree),
    all(debtFree => debtFree === true)
  );
}

type EffectSpeed = "mana" | "instant" | "sorcery";

export interface ManaAbility extends Ability {
  isManaAbility: true;
  effect: () => Partial<ManaPool>;
}

export interface Ability {
  speed: EffectSpeed;

  /**
   * In accordance to the rules 605.1a-b
   * @link https://mtg.gamepedia.com/Mana_ability
   */
  isManaAbility: boolean;

  /**
   * Special actions and mana abilities don't use the stack
   * @link https://mtg.gamepedia.com/Stack#Actions_that_don.27t_use_the_stack
   */
  usesStack: boolean;

  effect: () => unknown;

  cost: ActivationCost;
}

export namespace Ability {
  export const isManaAbility = (ability: Ability): ability is ManaAbility =>
    ability.isManaAbility;

  export const Empty: Ability = {
    speed: "instant",
    isManaAbility: false,
    usesStack: true,
    effect: () => {},
    cost: ActivationCost.Empty
  };

  export const getManaAbility = (gain: Partial<ManaPool>): ManaAbility => ({
    speed: "mana",
    isManaAbility: true,
    usesStack: false,
    effect: () => gain,
    cost: { ...ActivationCost.Empty, tapSelf: true }
  });

  export const TapForBlackMana = Ability.getManaAbility({ b: 1 });

  const isLegalAbilityFor = (permanent: Permanent) => (ability: Ability) =>
    !ability.cost.tapSelf || !permanent.isTapped;

  export const hasLegalAbilities = (permanent: Permanent): boolean =>
    pipe(
      map(isLegalAbilityFor(permanent)),
      any(result => result)
    )(permanent.abilities);
}

export interface GameState {
  manaPool: ManaPool;
  health: number;
  hand: Card[];
  board: Permanent[];
  deck: Card[];
  graveyard: Card[];
  nextCardId: number;
}

export const TAP_PERMANENT = "TAP_PERMANENT";
interface TapAction {
  type: typeof TAP_PERMANENT;
  id: number;
}

export const ENTER_PERMANENT_TO_BATTLEFIELD = "ENTER_PERMANENT_TO_BATTLEFIELD";
interface EnterPermanentToBattlefieldAction {
  type: typeof ENTER_PERMANENT_TO_BATTLEFIELD;
  permanent: Permanent;
}

export const ACTIVATE_ABILITY = "ACTIVATE_ABILITY";
interface ActivateAbilityAction {
  type: typeof ACTIVATE_ABILITY;
  permanentId: number;
  abilityId: number;
}

export type GameStateActions =
  | TapAction
  | EnterPermanentToBattlefieldAction
  | ActivateAbilityAction;
