import { all, any, equals, map, pipe, sum, values } from 'ramda';
import { isBoolean } from 'util';
import { assert } from '../util';

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
    manaPool: Partial<ManaPool>,
    addition: Partial<ManaPool>
  ): ManaPool => ({
    r: (manaPool.r || 0) + (addition.r || 0),
    g: (manaPool.g || 0) + (addition.g || 0),
    b: (manaPool.b || 0) + (addition.b || 0),
    u: (manaPool.u || 0) + (addition.u || 0),
    w: (manaPool.w || 0) + (addition.w || 0),
    c: (manaPool.c || 0) + (addition.c || 0)
  });

  export const IsEmpty = (partialManaPool: Partial<ManaPool>) =>
    pipe(
      values,
      sum,
      equals(0)
    )(partialManaPool);
}

export type CardSuperType = 'basic';
export type CardType = 'instant' | 'land' | 'swamp' | 'mountain';
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
  export const Mountain: CardTypeInfo = BasicLand('mountain');
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
  onResolve: CardLifetimeEventHandler;
  typeInfo: CardTypeInfo;
  canProvideManaNow: (state: GameState) => boolean;
}

export namespace Card {
  export const NULL: Card = {
    castingCost: {},
    name: '',
    id: 0,
    abilities: [],
    typeInfo: { types: [] },
    onResolve: state => state,
    canProvideManaNow: () => false
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

  export const isLand = (card: Card): boolean =>
    card.typeInfo.types.indexOf('land') >= 0;

  export const isInstant = (card: Card): boolean =>
    card.typeInfo.types.indexOf('instant') >= 0;
}

export type Permanent = Card & {
  isTapped: boolean;
};

export namespace Permanent {
  export const NULL: Permanent = {
    ...Card.NULL,
    isTapped: false
  };

  export const matches = (card: Card): card is Permanent =>
    (card as any).isTapped !== undefined;
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

  canBeActivated: (card: Card, state: GameState) => boolean;
}

export namespace Ability {
  export const isManaAbility = (ability: Ability): ability is ManaAbility =>
    ability.isManaAbility;

  export const Empty: Ability = {
    speed: 'instant',
    isManaAbility: false,
    usesStack: true,
    effect: () => {},
    cost: ActivationCost.NULL,
    canBeActivated: () => false
  };

  export const getManaAbility = (gain: Partial<ManaPool>): ManaAbility => ({
    speed: 'mana',
    isManaAbility: true,
    usesStack: false,
    effect: () => gain,
    cost: { ...ActivationCost.NULL, tapSelf: true },
    canBeActivated: card => (Permanent.matches(card) ? !card.isTapped : true)
  });

  export const TapForBlackMana = Ability.getManaAbility({ b: 1 });
  export const TapForRedMana = Ability.getManaAbility({ r: 1 });

  const isLegalAbilityFor = (permanent: Permanent) => (ability: Ability) =>
    !ability.cost.tapSelf || !permanent.isTapped;

  export const hasLegalAbilities = (permanent: Permanent): boolean =>
    pipe(
      map(isLegalAbilityFor(permanent)),
      any(result => result)
    )(permanent.abilities);
}

export type Zone = 'hand' | 'battlefield' | 'stack' | null;

export namespace Zone {
  export const toCardArray = (zone: Zone, state: GameState): Card[] => {
    switch (zone) {
      case 'battlefield':
        return state.board;
      case 'hand':
        return state.hand;
      case 'stack':
        return state.stack;
      default:
        throw new Error('unhandled zone: ' + zone);
    }
  };

  const cardIsInArray = (cards: Card[], card: Card) =>
    cards.find(card_ => card_.id === card.id) !== undefined;

  export const cardIsIn = (zone: Zone, card: Card, state: GameState): boolean =>
    cardIsInArray(toCardArray(zone, state), card);

  export const find = (card: Card, state: GameState): Zone => {
    const foundZone = (['hand', 'battlefield', 'stack'] as Zone[])
      .map((zone: Zone) => (cardIsIn(zone, card, state) ? zone : null))
      .filter(zone => zone !== null);

    assert(() => foundZone.length === 1);
    return foundZone[0];
  };
}

export interface GameState {
  manaPool: ManaPool;
  health: number;
  hand: Card[];
  board: Permanent[];
  deck: Card[];
  stack: Card[];
  graveyard: Card[];
  nextCardId: number;
  owedMana: Partial<ManaPool>;
  activatableCardIds: number[];
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
    nextCardId: 0,
    owedMana: {},
    activatableCardIds: []
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

export const REQUEST_PAY_SINGLE_MANA_COST = 'REQUEST_PAY_SINGLE_MANA_COST';
interface RequestPaySingleManaCostAction {
  type: typeof REQUEST_PAY_SINGLE_MANA_COST;
  mana: keyof ManaPool;
}

export type GameStateActions =
  | TapAction
  | ActivateAbilityAction
  | MoveCardBetweenZonesAction
  | CastAction
  | PopStackAction
  | RequestPaySingleManaCostAction;
