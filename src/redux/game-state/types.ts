import { all, any, map, pipe, values } from 'ramda';
import { isBoolean } from 'util';

export interface ManaPool {
  r: number;
  g: number;
  b: number;
  u: number;
  w: number;
  c: number;
}

export namespace ManaPool {
  export const NULL: ManaPool = {
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

export type CardSuperType = 'basic';
export type CardType = 'instant' | 'land' | 'swamp';
export interface CardTypeInfo {
  superType?: CardSuperType;
  types: CardType[];
}

export namespace CardTypeInfo {
  const BasicLand = (landType: CardType): CardTypeInfo => ({
    superType: 'basic',
    types: ['land', landType]
  });

  export const Swamp: CardTypeInfo = BasicLand('swamp');
  export const Instant: CardTypeInfo = { types: ['instant'] };
}

export type CardLifetimeEventHandler = (state: GameState) => GameState;

export namespace CardLifetimeEventHandler {
  export const NULL: CardLifetimeEventHandler = state => state;
}

export interface Card {
  castingCost: Partial<ManaPool>;
  name: string;
  id: number;
  abilities: Ability[];
  onCast: CardLifetimeEventHandler;
  onResolve: CardLifetimeEventHandler;
  typeInfo: CardTypeInfo;
}

export namespace Card {
  export const NULL: Card = {
    castingCost: {},
    name: '',
    id: 0,
    abilities: [],
    typeInfo: { types: [] },
    onCast: state => state,
    onResolve: state => state
  };

  export const getColor = (card: Card): Array<keyof ManaPool> => {
    const result = (Object.entries(card.castingCost) as Array<
      [keyof ManaPool, number]
    >).reduce(
      (acc, [color, costAmount]) =>
        color !== 'c' && costAmount > 0 ? [...acc, color] : acc,
      [] as Array<keyof ManaPool>
    );

    return result.length > 0 ? result : ['c'];
  };
}

export type Permanent = Card & {
  isTapped: boolean;
};

export namespace Permanent {
  export const NULL: Permanent = {
    ...Card.NULL,
    isTapped: false
  };
}

export type ActivationCost = ManaPool & {
  tapSelf: boolean;
};

export namespace ActivationCost {
  export const NULL: ActivationCost = {
    ...ManaPool.NULL,
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

type EffectSpeed = 'mana' | 'instant' | 'sorcery';

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
    speed: 'instant',
    isManaAbility: false,
    usesStack: true,
    effect: () => {},
    cost: ActivationCost.NULL
  };

  export const getManaAbility = (gain: Partial<ManaPool>): ManaAbility => ({
    speed: 'mana',
    isManaAbility: true,
    usesStack: false,
    effect: () => gain,
    cost: { ...ActivationCost.NULL, tapSelf: true }
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

export type Zone = 'hand' | 'battlefield' | 'stack' | null;

export interface GameState {
  manaPool: ManaPool;
  health: number;
  hand: Card[];
  board: Permanent[];
  deck: Card[];
  stack: Card[];
  graveyard: Card[];
  nextCardId: number;
}

export namespace GameState {
  export const NULL: GameState = {
    manaPool: ManaPool.NULL,
    board: [],
    graveyard: [],
    hand: [],
    deck: [],
    stack: [],
    health: 20,
    nextCardId: 0
  };
}

export const TAP_PERMANENT = 'TAP_PERMANENT';
interface TapAction {
  type: typeof TAP_PERMANENT;
  id: number;
}

export const ACTIVATE_ABILITY = 'ACTIVATE_ABILITY';
interface ActivateAbilityAction {
  type: typeof ACTIVATE_ABILITY;
  permanentId: number;
  abilityId: number;
}

export const MOVE_CARD_BETWEEN_ZONES = 'MOVE_CARD_BETWEEN_ZONES';
interface MoveCardBetweenZonesAction {
  type: typeof MOVE_CARD_BETWEEN_ZONES;
  card: Card;
  from: Zone;
  to: Zone;
}

export const CAST = 'CAST';
interface CastAction {
  type: typeof CAST;
  card: Card;
}

export const POP_STACK = 'POP_STACK';
interface PopStackAction {
  type: typeof POP_STACK;
}

export type GameStateActions =
  | TapAction
  | ActivateAbilityAction
  | MoveCardBetweenZonesAction
  | CastAction
  | PopStackAction;
