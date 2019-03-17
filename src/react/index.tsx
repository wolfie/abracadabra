import { moveCardBetweenZonesAction } from '../redux/game-state/actions';
import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import reduxMulti from 'redux-multi';
import * as ReactDOM from 'react-dom';
import { gameStateReducer } from '../redux/game-state/reducers';
import Game from './Game';
import * as M20 from '../redux/sets/M20';
import * as A25 from '../redux/sets/A25';
import * as M11 from '../redux/sets/M11';

const anyWindow = window as any;

const createStoreWithMiddleware = applyMiddleware(reduxMulti)(createStore);
const store = createStoreWithMiddleware(
  gameStateReducer,
  anyWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
    anyWindow.__REDUX_DEVTOOLS_EXTENSION__()
);

store.dispatch([
  moveCardBetweenZonesAction(M20.swamp, null, 'hand'),
  moveCardBetweenZonesAction(M20.mountain, null, 'hand'),
  moveCardBetweenZonesAction(A25.darkRitual, null, 'hand'),
  moveCardBetweenZonesAction(M11.pyreticRitual, null, 'hand')
]);

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('example')
);
