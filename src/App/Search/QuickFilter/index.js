import {Grid, Row, Col} from "react-bootstrap";
import InputGroup from "../Components/InputGroup";
import Query from "../Query";

export default class QuickFilter extends React.Component {
  static get propTypes() {
    return {
      queryCallback: PropTypes.func.isRequired
    };
  }
  /* eslint-disable no-console */
  static get defaultProps() {
    return {
      queryCallback: (query) => (
        console.log("Quick Filter Query Callback...", query)
      )
    };
  }
  /* eslint-enable no-console */
  constructor(props, context) {
    super(props, context);
    this.state = {
      jsonQuery: {
        order: "desc",
        sort: "activity",
        site: "stackoverflow"
      }
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
    const {jsonQuery} = this.state;
    return (
      <Row className="quick-filter">
        <Grid>
          <Query query={ jsonQuery } />
          <Row>
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
