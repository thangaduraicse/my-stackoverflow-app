import {Switch, Route} from "react-router-dom";
import {Grid} from "react-bootstrap";

import Header from "./Header";
import Home from "./Home";
import Search from "./Search";

export default class Layout extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Grid fluid>
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route exact path="/search" component={ Search } />
          </Switch>
        </Grid>
      </div>
    );
  }
}
