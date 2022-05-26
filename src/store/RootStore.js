import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import RootReducer from './RootReducer';
import RootSage from './RootSage';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(RootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware, thunk)));
sagaMiddleware.run(RootSage);

export default store;
