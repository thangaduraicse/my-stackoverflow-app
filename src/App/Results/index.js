import {Row, Col} from "react-bootstrap";
import {NavLink} from "react-router-dom";

const Results = (props) => {
  const {results} = props;

  if (results.length) {
    return (
      <Row>
        <Col xs={ 12 }>
          <div>Result Came!</div>
        </Col>
      </Row>
    );
  }

  return (
    <Row className="results">
      <Col xs={ 12 }>
        <h6>Re-run the search. No results found!</h6>
        <div className="spaced">
          <NavLink
            exact
            to="/search"
          >Click me</NavLink>
        </div>
      </Col>
    </Row>
  );
};

Results.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired
};

Results.defaultProps = {
  results: []
};

export default Results;
