import {applyMiddleware, combineReducers, createStore} from "redux";
import eventsReducer from "./events-reducer";
import thunkMiddleware from "redux-thunk";
import authReducer from "./auth-reducer";

const rootReducer = combineReducers({
    eventsPage: eventsReducer,
    userAuthorize: authReducer
})

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

export default store;