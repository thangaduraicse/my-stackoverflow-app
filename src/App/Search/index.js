import AdvancedFilter from "./AdvancedFilter";

const sampleData = {"sort":"activity",
"order":"desc",
"page":"12313213",
"fromdate":"2017-10-04",
"todate":"2017-10-12"};
const Search = () => <div><AdvancedFilter searchQuery={ sampleData } /></div>;
export default Search;
