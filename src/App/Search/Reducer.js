import Types from "./Types";

const initialState = {
  isRequesting: false,
  results: [],
  exception: {
    message: ""
  }
};

const searchReducer = (state = initialState, action) => {
  switch(action.type) {
    case Types.GET_SEARCH_RESULTS_REQ:
      return {
        ...state,
        isRequesting: action.isRequesting,
        exception: initialState.exception
      };
    case Types.GET_SEARCH_RESULTS_SUCCESS:
      return {
        ...state,
        results: action.results,
        isRequesting: initialState.isRequesting,
        exception: initialState.exception
      };
    case Types.GET_SEARCH_RESULTS_FAIL:
      return {
        ...state,
        exception: action.exception,
        isRequesting: initialState.isRequesting
      };
    case Types.CLEAR_SEARCH_STORE:
      return initialState;
    default:
      return state;
  }
};

export {
  initialState
};

export default searchReducer;
