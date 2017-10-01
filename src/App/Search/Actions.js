import Types from "./Types";

const getSearchResultsReq = isRequesting => ({
  type: Types.GET_SEARCH_RESULTS_REQ,
  isRequesting
});

const getSearchResultsSuccess = results => ({
  type: Types.GET_SEARCH_RESULTS_SUCCESS,
  results
});

const getSearchResultsFail = exception => ({
  type: Types.GET_SEARCH_RESULTS_FAIL,
  exception
});

const getSearchResults = searchUrl => (dispatch, getState) => {
  dispatch(getSearchResultsReq(true));
  return fetch(searchUrl, {
    method: "GET",
    cache: "default"
  })
  .then(res => res.json())
  .then(json => dispatch(getSearchResultsSuccess(json)))
  .catch(ex => dispatch(getSearchResultsFail(ex)));
};

const clearSearchStore = () => ({
  type: Types.CLEAR_SEARCH_STORE
});

export {
  getSearchResultsReq,
  getSearchResultsSuccess,
  getSearchResultsFail,
  getSearchResults,
  clearSearchStore
};
