import {Grid, Row, Col} from "react-bootstrap";
import InputGroup from "../Components/InputGroup";
import CalendarGroup from "../Components/CalendarGroup";
import DropdownGroup from "../Components/DropdownGroup";
import Constants from "./Constants";

export default class AdvancedFilter extends React.Component {
  static get propTypes() {
    return {
      searchQuery: PropTypes.object.isRequired
    };
  }
  static get defaultProps() {
    return {
      searchQuery: {}
    };
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      formData: props.searchQuery
    };
  }
  onFieldGroupChange = (cb) => {
    const {formData} = this.state;
    this.setState({
      formData: Object.assign({}, formData, cb)
    });
  }
  render() {
    const {searchQuery} = this.props;
    return (
      <Row className="advanced-filter">
        <Grid>
          <div>
            <Row className="spaced">
              <Col xs={ 12 }>
                <pre className="fetched-url">
                  <code>{JSON.stringify(this.state.formData)}</code>
                </pre>
              </Col>
            </Row>
            <Row className="spaced">
              <form>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="page" 
                    label="Page"
                    inputClassName="number-type"
                    pattern="[0-9]*"
                    defaultValue={ searchQuery.page }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="pagesize" 
                    label="Page Size"
                    inputClassName="number-type"
                    pattern="[0-9]*"
                    defaultValue={ searchQuery.pagesize }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <CalendarGroup 
                    id="fromdate" 
                    label="From Date"
                    className="date-type"
                    defaultValue={ searchQuery.fromdate }
                    onCalendarChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <CalendarGroup 
                    id="todate" 
                    label="To Date"
                    className="date-type"
                    defaultValue={ searchQuery.todate }
                    onCalendarChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <DropdownGroup 
                    id="order" 
                    label="Order"
                    className="dropdown-type"
                    data={ Constants.order.data }
                    defaultValue={ searchQuery.order }
                    onDropdownChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <DropdownGroup 
                    id="sort" 
                    label="Sort"
                    className="dropdown-type"
                    data={ Constants.sort.data }
                    defaultValue={ searchQuery.sort }
                    onDropdownChange={ this.onFieldGroupChange } 
                  />
                </Col>
                {
                  (searchQuery.sort === "activity" || 
                    searchQuery.sort === "creation") ? (
                    <div>
                      <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                        <CalendarGroup 
                          id="min" 
                          label="Min"
                          className="date-type"
                          defaultValue={ searchQuery.min }
                          onCalendarChange={ this.onFieldGroupChange } 
                        />
                      </Col>
                      <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                        <CalendarGroup 
                          id="max" 
                          label="Max"
                          className="date-type"
                          defaultValue={ searchQuery.max }
                          onCalendarChange={ this.onFieldGroupChange } 
                        />
                      </Col>
                    </div>
                  ) : searchQuery.sort === "votes" ? (
                    <div>
                      <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                        <InputGroup 
                          id="min" 
                          label="Min"
                          inputClassName="number-type"
                          pattern="[0-9]*"
                          defaultValue={ searchQuery.min }
                          onInputChange={ this.onFieldGroupChange } 
                        />
                      </Col>
                      <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                        <InputGroup 
                          id="max" 
                          label="Max"
                          inputClassName="number-type"
                          pattern="[0-9]*"
                          defaultValue={ searchQuery.max }
                          onInputChange={ this.onFieldGroupChange } 
                        />
                      </Col>
                    </div>
                  ) : null
                }
                    
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="q" 
                    label="Query"
                    inputClassName="string-type"
                    defaultValue={ searchQuery.q }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <DropdownGroup 
                    id="accepted" 
                    label="Accepted"
                    className="dropdown-type"
                    data={ Constants.boolean.data }
                    defaultValue={ searchQuery.accepted }
                    onDropdownChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="answers" 
                    label="Answers"
                    inputClassName="number-type"
                    pattern="[0-9]*"
                    defaultValue={ searchQuery.answers }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="body" 
                    label="Body"
                    inputClassName="string-type"
                    defaultValue={ searchQuery.body }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <DropdownGroup 
                    id="closed" 
                    label="Closed"
                    className="dropdown-type"
                    data={ Constants.boolean.data }
                    defaultValue={ searchQuery.closed }
                    onDropdownChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <DropdownGroup 
                    id="migrated" 
                    label="Migrated"
                    className="dropdown-type"
                    data={ Constants.boolean.data }
                    defaultValue={ searchQuery.migrated }
                    onDropdownChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <DropdownGroup 
                    id="notice" 
                    label="Notice"
                    className="dropdown-type"
                    data={ Constants.boolean.data }
                    defaultValue={ searchQuery.notice }
                    onDropdownChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="nottagged" 
                    label="Not Tagged"
                    inputClassName="list-type"
                    defaultValue={ searchQuery.nottagged }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="tagged" 
                    label="Tagged"
                    inputClassName="list-type"
                    defaultValue={ searchQuery.tagged }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="title" 
                    label="Title"
                    inputClassName="string-type"
                    defaultValue={ searchQuery.title }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="user" 
                    label="User"
                    inputClassName="number-type"
                    pattern="[0-9]*"
                    defaultValue={ searchQuery.user }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="url" 
                    label="URL"
                    inputClassName="string-type"
                    defaultValue={ searchQuery.url }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <InputGroup 
                    id="views" 
                    label="Views"
                    inputClassName="number-type"
                    pattern="[0-9]*"
                    defaultValue={ searchQuery.views }
                    onInputChange={ this.onFieldGroupChange } 
                  />
                </Col>
                <Col lg={ 3 } md={ 4 } sm={ 6 } xs={ 12 }>
                  <DropdownGroup 
                    id="wiki" 
                    label="WIKI"
                    className="dropdown-type"
                    data={ Constants.boolean.data }
                    defaultValue={ searchQuery.wiki }
                    onDropdownChange={ this.onFieldGroupChange } 
                  />
                </Col>
              </form>
            </Row>
          </div>
        </Grid>
      </Row>
    );
  }
}
