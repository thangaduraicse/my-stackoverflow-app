import {Row, Col, Button} from "react-bootstrap";

const Query = (props) => {
  const {apiUrl, query, onRun} = props;

  const queryParams = Object.keys(query).map(key => 
    `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
  ).join("&");
  const searchQuery = `${apiUrl}?${queryParams}`;

  return (
    <Row className="search-query">
      <Col xs={ 12 }>
        <pre>
          <h6>
            <u>Search URL:</u>
            <div className="search-query-run-btn">
              <Button 
                onClick={ () => onRun(searchQuery) }
                bsStyle="warning"
              >Run</Button>
            </div>
          </h6>
          <code>
            <a href={ searchQuery } target="_blank">{searchQuery}</a>
          </code>
        </pre>
      </Col>
    </Row>
  );
};

Query.propTypes = {
  query: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  onRun: PropTypes.func.isRequired
};

Query.defaultProps = {
  query: {},
  apiUrl: "http://api.stackexchange.com/2.2/search/advanced",
  /* eslint-disable no-console */
  onRun: (url) => (console.log("Search Query URL...", url))
  /* eslint-enable no-console */
};

export default Query;
