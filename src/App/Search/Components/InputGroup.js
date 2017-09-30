import {FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import omit from "lodash/omit";

export default class InputGroup extends React.Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      defaultValue: PropTypes.string,
      onInputChange: PropTypes.func,
      inputClassName: PropTypes.string
    };
  }
  static get defaultProps() {
    return {
      type: "text",
      defaultValue: "",
      onInputChange: (value) => ({}),
      inputClassName: ""
    };
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: props.defaultValue
    };
  }
  componentWillReceiveProps(newProps) {
    if (this.props.defaultValue !== newProps.defaultValue && 
      newProps.defaultValue !== "") {
      this.setState({
        value: newProps.defaultValue
      });
    }
  }
  handleChange = e => {
    const value = e.target.validity.valid ? e.target.value : this.state.value;
    this.setState({value}, () => {
      this.props.onInputChange({
        [this.props.id]: value
      });
    });
  }
  render() {
    const {id, label, inputClassName} = this.props;
    const remainingProps = omit(this.props, [
      "id", 
      "label", 
      "inputClassName",
      "onInputChange",
      "defaultValue"
    ]);
    const {value} = this.state;
    return (
      <FormGroup controlId={ id }>
        <ControlLabel>{label}</ControlLabel>
        <FormControl
          { ...remainingProps }
          className={ inputClassName }
          onChange={ this.handleChange }
          value={ value }
        />
      </FormGroup>
    );
  }
}
