import { moveCardBetweenZonesAction } from '../redux/game-state/actions';
import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reduxMulti from 'redux-multi';
import * as ReactDOM from 'react-dom';
import gameStateReducer from '../redux/game-state/reducer';
import Game from './Game';
import * as M20 from '../redux/sets/M20';
import * as A25 from '../redux/sets/A25';
import * as M11 from '../redux/sets/M11';
import { Card } from '../redux/game-state/types';

const anyWindow = window as any;

const createStoreWithMiddleware = applyMiddleware(reduxMulti)(createStore);
const store = createStoreWithMiddleware(
  gameStateReducer,
  anyWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
    anyWindow.__REDUX_DEVTOOLS_EXTENSION__()
);

store.dispatch([
  moveCardBetweenZonesAction(Card.from(M20.swamp, 0), null, 'hand'),
  moveCardBetweenZonesAction(Card.from(M20.mountain, 1), null, 'hand'),
  moveCardBetweenZonesAction(Card.from(A25.darkRitual, 2), null, 'hand'),
  moveCardBetweenZonesAction(Card.from(M11.pyreticRitual, 3), null, 'hand'),
  moveCardBetweenZonesAction(Card.from(M11.ornithopter, 4), null, 'hand')
]);

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('example')
);
