import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reduxMulti from 'redux-multi';
import { moveCardsBetweenZonesAction } from '../redux/game-state/actions';
import { gameStateReducer } from '../redux/game-state/reducers';
import {
  Ability,
  Card,
  CardLifetimeEventHandler,
  CardTypeInfo,
  GameState,
  ManaPool,
  Permanent,
  Zone
} from '../redux/game-state/types';
import Game from './Game';

const anyWindow = window as any;

const createStoreWithMiddleware = applyMiddleware(reduxMulti)(createStore);
const store = createStoreWithMiddleware(
  gameStateReducer,
  anyWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
    anyWindow.__REDUX_DEVTOOLS_EXTENSION__()
);

const swamp: Card = {
  castingCost: {},
  abilities: [Ability.TapForBlackMana],
  id: 0,
  name: 'Swamp',
  typeInfo: CardTypeInfo.Swamp,
  onResolve: CardLifetimeEventHandler.NULL,
  canProvideManaNow: (state: GameState) =>
    Zone.cardIsIn('battlefield', swamp, state) &&
    Permanent.matches(swamp) &&
    swamp.isTapped
};

const mountain: Card = {
  castingCost: {},
  abilities: [Ability.TapForRedMana],
  id: 3,
  name: 'Mountain',
  typeInfo: CardTypeInfo.Mountain,
  onResolve: CardLifetimeEventHandler.NULL,
  canProvideManaNow: (state: GameState) =>
    Zone.cardIsIn('battlefield', mountain, state) &&
    Permanent.matches(mountain) &&
    mountain.isTapped
};

const darkRitual: Card = {
  castingCost: { b: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { b: 3 })
  }),
  id: 1,
  name: 'Dark Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};

const pyreticRitual: Card = {
  castingCost: { r: 1, c: 1 },
  abilities: [],
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { r: 3 })
  }),
  id: 2,
  name: 'Pyretic Ritual',
  typeInfo: CardTypeInfo.Instant,
  canProvideManaNow: () => false
};

store.dispatch([
  moveCardsBetweenZonesAction(swamp, null, 'hand'),
  moveCardsBetweenZonesAction(mountain, null, 'hand'),
  moveCardsBetweenZonesAction(darkRitual, null, 'hand'),
  moveCardsBetweenZonesAction(pyreticRitual, null, 'hand')
]);

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('example')
);
