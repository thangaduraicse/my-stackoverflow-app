import {FormGroup, ControlLabel} from "react-bootstrap";
import DatePicker from "react-datepicker";

import "react-datepicker/src/stylesheets/datepicker.scss";

export default class CalendarGroup extends React.Component {
  static get propTypes() {
    return {
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      defaultValue: PropTypes.string,
      onCalendarChange: PropTypes.func,
      className: PropTypes.string,
      format: PropTypes.string
    };
  }
  static get defaultProps() {
    return {
      type: "text",
      defaultValue: "",
      onCalendarChange: (value) => ({}),
      className: "",
      format: "YYYY-MM-DD"
    };
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      date: props.defaultValue === "" ? null : 
        moment(props.defaultValue)
    };
  }
  componentWillReceiveProps(newProps) {
    if (newProps.defaultValue !== "") {
      this.setState({
        date: moment(newProps.defaultValue)
      });
    }
  }
  handleChange = date => {
    this.setState({date}, () => {
      const newDate = moment(date).format(this.props.format);
      this.props.onCalendarChange({
        [this.props.id]: newDate
      });
    });
  }
  render() {
    const {id, label, className, format} = this.props;
    const {date: selectedDate} = this.state;
    return (
      <FormGroup controlId={ id }>
        <ControlLabel>{label}</ControlLabel>
        <DatePicker
          id={ id }
          className={ `form-control ${className}` }
          selected={ selectedDate }
          dateFormat={ format }
          onChange={ this.handleChange }
        />
      </FormGroup>
    );
  }
}
