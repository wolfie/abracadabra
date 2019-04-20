import { Card, GameState, Zone } from '../types';
import { assert } from '../../util';

const moveCardBetweenZonesReducer = (
  state: GameState,
  card: Card,
  from: Zone,
  to: Zone
): GameState => {
  assert(() => from !== to);
  const notThisCard = (card_: Card) => card_.id !== card.id;

  switch (from) {
    case null:
      break;
    case 'hand':
      state = {
        ...state,
        hand: state.hand.filter(notThisCard)
      };
      break;
    case 'battlefield':
      state = { ...state, board: state.board.filter(notThisCard) };
      break;
    case 'stack':
      state = { ...state, stack: state.stack.filter(notThisCard) };
      break;
    default:
      throw new Error('unsupported from-zone: ' + from);
  }

  switch (to) {
    case null:
      break;
    case 'hand':
      state = { ...state, hand: [...state.hand, card] };
      break;
    case 'battlefield':
      state = {
        ...state,
        board: [...state.board, { ...card, isTapped: false }]
      };
      break;
    case 'stack':
      state = { ...state, stack: [...state.stack, card] };
      break;
    default:
      throw new Error('unsupported to-zone: ' + to);
  }

  return state;
};

export default moveCardBetweenZonesReducer;
