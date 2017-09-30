import {
  FormGroup, ControlLabel, DropdownButton, MenuItem
} from "react-bootstrap";

export default class DropdownGroup extends React.Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      placeholder: PropTypes.string,
      className: PropTypes.string,
      labelField: PropTypes.string.isRequired,
      valueField: PropTypes.string.isRequired,
      defaultValue: PropTypes.string,
      onDropdownChange: PropTypes.func
    };
  }
  static get defaultProps() {
    return {
      data: [],
      placeholder: "Select an option",
      className: "",
      labelField: "label",
      valueField: "value",
      defaultValue: "",
      onDropdownChange: (value) => ({})
    };
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      selected: {},
      activeStatus: []
    };
  }
  componentWillMount() {
    this.getSelectedMenu(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.getSelectedMenu(nextProps);
    }
  }
  getSelectedMenu = (props) => {
    const {valueField, data, defaultValue} = props;
    data.map((menu, index) => {
      if (menu[valueField] === defaultValue) {
        this.onSelectMenu(menu, index);
        return;
      }
    });
  }
  onSelectMenu = (selected, menuIndex) => {
    const newArray = new Array(this.props.data.length);
    let activeStatus = newArray.fill(false);
    activeStatus[menuIndex] = true;

    this.setState({selected, activeStatus}, () => {
      const {valueField, onDropdownChange, id} = this.props;
      onDropdownChange({
        [id]: selected[valueField]
      });
    });
  }
  renderMenuItem = () => {
    let {data, labelField} = this.props;
    const {activeStatus} = this.state;
    const menuItems = data.map((menu, index) => {
      return (
        <MenuItem
          key={ index }
          className={ activeStatus[index] ? "active" : "" }
          onSelect={ () => this.onSelectMenu(menu, index) }
        >{menu[labelField]}</MenuItem>
      );
    });
    return menuItems;
  }
  render() {
    const {id, label, placeholder, className, labelField} = this.props;
    const {selected} = this.state;
    return (
      <FormGroup controlId={ id }>
        <ControlLabel>{label}</ControlLabel>
        <DropdownButton
          ref={ comp => this._dropdownMenu = comp }
          id={ id }
          className={ className }
          title={ selected[labelField] || placeholder }
        >
          {this.renderMenuItem()}
        </DropdownButton>
      </FormGroup>
    );
  }
}
