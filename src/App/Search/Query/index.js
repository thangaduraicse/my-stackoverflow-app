import {Row, Col, Button} from "react-bootstrap";

const jsonToQueryString = (apiUrl, queryJson) => {
  const queryParams = Object.keys(queryJson).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(queryJson[key])}`;
  }).join("&");
  return `${apiUrl}?${queryParams}`;
};

const Query = (props) => {
  const {apiUrl, query, onRun} = props;

  const searchQuery = jsonToQueryString(apiUrl, query);

  return (
    <Row>
      <Col xs={ 12 } className="spaced">
        <pre className="fetched-url">
          <div className="text-left">
            <h6><u>Search URL:</u></h6>
            <code>
              <a href={ searchQuery } target="_blank">{searchQuery}</a>
            </code>
          </div>
          <div className="text-right">
            <Button 
              onClick={ () => onRun(searchQuery) }
              bsStyle="warning"
            >Run</Button>
          </div>
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
