import { any, map, pipe } from 'ramda';
import { assert } from '../util';

export namespace ManaPool {
  export const NULL: AnAmountOfEachMana = {
    r: 0,
    g: 0,
    b: 0,
    u: 0,
    w: 0,
    c: 0
  };
}

export type CardSuperType = 'basic';
export type CardType =
  | 'instant'
  | 'land'
  | 'swamp'
  | 'mountain'
  | 'artifact'
  | 'creature';
export type CardSubType = 'thopter';
export interface CardTypeInfo {
  superType?: CardSuperType;
  types: CardType[];
  subTypes?: CardSubType[];
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

export interface HasTypeInfo {
  typeInfo: CardTypeInfo;
}

type RED = 'r';
type BLUE = 'u';
type GREEN = 'g';
type BLACK = 'b';
type WHITE = 'w';
type COLORLESS = 'c';
type GENERIC = '_';

export type ManaColor = RED | BLUE | GREEN | BLACK | WHITE | COLORLESS;
export type ManaColorOrGeneric = ManaColor | GENERIC;

export type AnAmountOfEachMana = { [Color in ManaColor]: number };
export type AnAmountOfMana = Partial<AnAmountOfEachMana>;
export type AnAmountOfEachManaAndGeneric = AnAmountOfEachMana &
  { [COLOR in GENERIC]: number };
export type AnAmountOfManaOrGeneric = Partial<AnAmountOfEachManaAndGeneric>;

export interface CardPrototype extends HasTypeInfo {
  castingCost: AnAmountOfManaOrGeneric;
  name: string;
  abilities: Ability[];
  onResolve: CardLifetimeEventHandler;
  canProvideManaNow?: (state: GameState, self: Card) => boolean;
}

export namespace CardPrototype {
  export const NULL: CardPrototype = {
    castingCost: {},
    name: '',
    abilities: [],
    typeInfo: { types: [] },
    onResolve: state => state
  };
}

export interface Card extends CardPrototype {
  id: number;
}

export namespace Card {
  export const from = (p: CardPrototype, id: number): Card => ({
    ...p,
    id
  });

  export const NULL = Card.from(CardPrototype.NULL, 0);

  export const getColor = (card: Card): ManaColor[] => {
    const result = (Object.entries(card.castingCost) as Array<
      [ManaColor, number]
    >).reduce(
      (acc, [color, costAmount]) =>
        color !== 'c' && costAmount > 0 ? [...acc, color] : acc,
      [] as ManaColor[]
    );

    return result.length > 0 ? result : ['c'];
  };
}

export type Permanent = Card & {
  isTapped: boolean;
};

export namespace Permanent {
  export const from = (card: Card, isTapped = false): Permanent => ({
    ...card,
    isTapped
  });

  export const matches = (card: Card | CardPrototype): card is Permanent =>
    (card as any).isTapped !== undefined;

  export const NULL: Permanent = Permanent.from(Card.NULL);
}

export type ActivationCost = AnAmountOfMana & {
  tapSelf?: boolean;
};

export namespace ActivationCost {
  export const NULL: ActivationCost = {
    ...ManaPool.NULL,
    tapSelf: false
  };
}

type EffectSpeed = 'mana' | 'instant' | 'sorcery';

export interface ManaAbility extends Ability {
  isManaAbility: true;
  effect: () => AnAmountOfMana;
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

  export const getManaAbility = (gain: AnAmountOfMana): ManaAbility => ({
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
  manaPool: AnAmountOfMana;
  health: number;
  hand: Card[];
  board: Permanent[];
  deck: Card[];
  stack: Card[];
  graveyard: Card[];
  nextCardId: number;
  owedMana: AnAmountOfManaOrGeneric;
  activatableCardIds: number[];
  stateBackup?: GameState;
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
  mana: ManaColor;
}

export const CANCEL_LAST_ACTION = 'CANCEL_LAST_ACTION';
interface CancelLastActionAction {
  type: typeof CANCEL_LAST_ACTION;
}

export const __HACK_SET_STATE_ACTION = '__HACK_SET_STATE_ACTION';
// tslint:disable-next-line: class-name
interface __HackSetStateAction {
  type: typeof __HACK_SET_STATE_ACTION;
  state: GameState;
}

export type GameStateActions =
  | ActivateAbilityAction
  | MoveCardBetweenZonesAction
  | CastAction
  | PopStackAction
  | RequestPaySingleManaCostAction
  | CancelLastActionAction
  | __HackSetStateAction;
