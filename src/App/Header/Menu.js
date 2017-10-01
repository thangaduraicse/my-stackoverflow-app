import {Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";

const Menu = () => (
  <Navbar fluid>
    <Navbar.Header />
    <ul className="nav navbar-nav">
      <li role="presentation">
        <NavLink exact to="/">Home</NavLink>
      </li>
      <li role="presentation">
        <NavLink exact to="/search">Search</NavLink>
      </li>
      <li role="presentation">
        <NavLink exact to="/results">Results</NavLink>
      </li>
    </ul>
  </Navbar>
);

export default Menu;
