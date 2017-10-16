import {Row, Col} from "react-bootstrap";
import DemoDropdown from "../Dropdown/demo";

const Home = () => (
  <Row>
    <Col xs={ 12 }>
      <h2>
        <em> Hi and welcome to My StackOverflow !! Let&#39;s do some searching. 
        Click search from the nav bar to navigate to the search page !!</em>
      </h2>
      <DemoDropdown />
    </Col>
  </Row>
);

export default Home;
