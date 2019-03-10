import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Game from './Game';
import { createStore, applyMiddleware } from 'redux';
import {
  gameStateReducer,
  moveCardBetweenZonesReducer
} from '../redux/game-state/reducers';
import { Provider } from 'react-redux';
import reduxMulti from 'redux-multi';
import {
  CardTypeInfo,
  ManaPool,
  Card,
  CardLifetimeEventHandler,
  Ability
} from '../redux/game-state/types';
import { moveCardsBetweenZones } from '../redux/game-state/actions';

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
  onCast: state =>
    // todo: allow only one land per turn
    moveCardBetweenZonesReducer(state, swamp, 'hand', 'battlefield'),
  onResolve: CardLifetimeEventHandler.NULL
};

const darkRitual: Card = {
  castingCost: { b: 1 },
  abilities: [],
  onCast: state =>
    moveCardBetweenZonesReducer(state, darkRitual, 'hand', 'stack'),
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { b: 3 })
  }),
  id: 1,
  name: 'Dark Ritual',
  typeInfo: CardTypeInfo.Instant
};

const pyreticRitual: Card = {
  castingCost: { r: 1, c: 1 },
  abilities: [],
  onCast: state =>
    moveCardBetweenZonesReducer(state, pyreticRitual, 'hand', 'stack'),
  onResolve: state => ({
    ...state,
    manaPool: ManaPool.Add(state.manaPool, { r: 3 })
  }),
  id: 2,
  name: 'Pyretic Ritual',
  typeInfo: CardTypeInfo.Instant
};

store.dispatch([
  moveCardsBetweenZones(swamp, null, 'hand'),
  moveCardsBetweenZones(darkRitual, null, 'hand'),
  moveCardsBetweenZones(pyreticRitual, null, 'hand')
]);

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('example')
);
