import Types from "./Types";

const getDropdownOptionReq = isRequesting => ({
  type: Types.GET_DROPDOWN_OPTION_REQ,
  isRequesting
});

const getDropdownOptionSuccess = results => ({
  type: Types.GET_DROPDOWN_OPTION_SUCCESS,
  results
});

const getDropdownOptionFail = exception => ({
  type: Types.GET_DROPDOWN_OPTION_FAIL,
  exception
});

const getDropdownOption = apiUrl => (dispatch, getState) => {
  dispatch(getDropdownOptionReq(true));
  return fetch(apiUrl, {
    method: "GET",
    cache: "default"
  })
  .then(res => res.json())
  .then(json => dispatch(getDropdownOptionSuccess(json)))
  .catch(ex => dispatch(getDropdownOptionFail(ex)));
};

const clearHomeStore = () => ({
  type: Types.CLEAR_HOME_STORE
});

export {
  getDropdownOptionReq,
  getDropdownOptionSuccess,
  getDropdownOptionFail,
  getDropdownOption,
  clearHomeStore
};
