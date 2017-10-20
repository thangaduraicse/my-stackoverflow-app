import {combineReducers} from "redux";
import homeReducer from "./App/Home/Reducer";
import searchReducer from "./App/Search/Reducer";

export default combineReducers({
  homeReducer,
  searchReducer
});
