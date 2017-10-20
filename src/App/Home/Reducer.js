import Types from "./Types";

const initialState = {
  isRequesting: false,
  results: [],
  exception: {
    message: ""
  }
};

const homeReducer = (state = initialState, action) => {
  switch(action.type) {
    case Types.GET_DROPDOWN_OPTION_REQ:
      return {
        ...state,
        isRequesting: action.isRequesting,
        exception: initialState.exception
      };
    case Types.GET_DROPDOWN_OPTION_SUCCESS:
      return {
        ...state,
        results: action.results,
        isRequesting: initialState.isRequesting,
        exception: initialState.exception
      };
    case Types.GET_DROPDOWN_OPTION_FAIL:
      return {
        ...state,
        exception: action.exception,
        isRequesting: initialState.isRequesting
      };
    case Types.CLEAR_HOME_STORE:
      return initialState;
    default:
      return state;
  }
};

export {
  initialState
};

export default homeReducer;
