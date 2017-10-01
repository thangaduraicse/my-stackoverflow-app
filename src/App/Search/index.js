import {Tabs, Tab} from "react-bootstrap";
import QuickFilter from "./QuickFilter";
import AdvancedFilter from "./AdvancedFilter";

const sampleData = {
  "sort":"activity",
  "order":"desc",
  "page":"12313213",
  "fromdate":"2017-10-04",
  "todate":"2017-10-12"
};

const Search = () => (
  <Tabs defaultActiveKey={ 1 } id="uncontrolled-tab">
    <Tab eventKey={ 1 } title="Quick Search">
      <QuickFilter />
    </Tab>
    <Tab eventKey={ 2 } title="Advanced Search">
      <AdvancedFilter defaultSearchQuery={ sampleData } />
    </Tab>
  </Tabs>
);

export default Search;
