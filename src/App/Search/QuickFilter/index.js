import {Grid, Row, Col} from "react-bootstrap";
import InputGroup from "../Components/InputGroup";

export default class QuickFilter extends React.Component {
  static get propTypes() {
    return {
      defaultSearchQuery: PropTypes.object.isRequired,
      queryCallback: PropTypes.func.isRequired
    };
  }
  /* eslint-disable no-console */
  static get defaultProps() {
    return {
      defaultSearchQuery: {
        order: "desc",
        sort: "activity",
        site: "stackoverflow"
      },
      queryCallback: (query) => (
        console.log("Quick Filter Query Callback...", query)
      )
    };
  }
  /* eslint-enable no-console */
  constructor(props, context) {
    super(props, context);
    this.state = {
      jsonQuery: props.defaultSearchQuery
    };
  }
  onFieldGroupChange = (cb) => {
    const cbValue = Object.values(cb)[0];
    const cbKey = Object.keys(cb)[0];

    let {jsonQuery} = this.state;
    if (cbValue !== "") {
      jsonQuery = Object.assign({}, jsonQuery, cb); 
    } else {
      jsonQuery = lod.omit(jsonQuery, [cbKey]);
    }

    this.setState({
      jsonQuery: jsonQuery
    }, () => (this.props.queryCallback({query: jsonQuery})));
  }
  render() {
    return (
      <Row className="search-quick-filter">
        <Grid>          
          <Row className="spaced">
            <Col xs={ 12 }>
              <InputGroup 
                id="q" 
                label="Query"
                inputClassName="string-type"
                onInputChange={ this.onFieldGroupChange } 
              />
            </Col>
          </Row>
        </Grid>
      </Row>
    );
  }
}
