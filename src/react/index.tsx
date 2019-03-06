import * as React from "react";
import * as ReactDOM from "react-dom";
import Game from "./Game";
import { createStore, applyMiddleware } from "redux";
import { gameStateReducer } from "../redux/game-state/reducers";
import { Provider } from "react-redux";
import reduxMulti from "redux-multi";

const anyWindow = window as any;

const createStoreWithMiddleware = applyMiddleware(reduxMulti)(createStore);
const store = createStoreWithMiddleware(
  gameStateReducer,
  anyWindow.__REDUX_DEVTOOLS_EXTENSION__ &&
    anyWindow.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <Game />
  </Provider>,
  document.getElementById("example")
);
