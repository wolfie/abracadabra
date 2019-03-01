import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Game from './Game';
import { createStore } from 'redux';
import { gameStateReducer } from '../redux/game-state/reducers';
import { Provider } from 'react-redux';

const anyWindow = window as any;
const store = createStore(
  gameStateReducer,
  anyWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
    anyWindow.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById('example')
);
