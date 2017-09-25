import {Provider} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";

import configureStore from "./stores";

import Layout from "./Hello";

const store = configureStore();

const routes = () => (
  <Provider store={ store }>
    <BrowserRouter basename={ window.__BASEPATH__ }>
      <div>
        <Route exact path="/" component={ Layout } />
      </div>
    </BrowserRouter>
  </Provider>
);

export default routes;
