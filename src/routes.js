import {Provider} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";

import configureStore from "./stores";

import App from "./App";

const store = configureStore();

const routes = () => (
  <Provider store={ store }>
    <BrowserRouter basename={ window.__BASEPATH__ }>
      <div>
        <Route path="/" component={ App } />
      </div>
    </BrowserRouter>
  </Provider>
);

export default routes;
