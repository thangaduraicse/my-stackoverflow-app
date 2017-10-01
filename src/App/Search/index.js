import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Tabs, Tab} from "react-bootstrap";
import QuickFilter from "./QuickFilter";
import AdvancedFilter from "./AdvancedFilter";
import Query from "./Query";

import {getSearchResults} from "./Actions";

@connect(
  state => ({}),
  dispatch => ({
    getSearchResults: bindActionCreators(getSearchResults, dispatch)
  })
)
export default class Search extends React.Component {
  static get propTypes() {
    return {
      getSearchResults: PropTypes.func.isRequired
    };
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      query: {}
    };
  }
  queryCallback = ({query}) => {
    this.setState({query});
  }
  render() {
    const {query} = this.state;
    return (
      <div className="search">
        {
          lod.isEmpty(query) ? null : (
            <Query query={ query } onRun={ this.props.getSearchResults } />
          )
        }
        <Tabs defaultActiveKey={ 1 } id="search-tab" className="spaced">
          <Tab eventKey={ 1 } title="Quick Search">
            <QuickFilter queryCallback={ this.queryCallback } />
          </Tab>
          <Tab eventKey={ 2 } title="Advanced Search">
            <AdvancedFilter queryCallback={ this.queryCallback } />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
