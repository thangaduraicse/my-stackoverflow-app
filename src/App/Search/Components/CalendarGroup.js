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
      format: PropTypes.string,
      shouldReturnTimestamp: PropTypes.bool,
      timestampFormat: PropTypes.string
    };
  }
  static get defaultProps() {
    return {
      type: "text",
      defaultValue: "",
      onCalendarChange: (value) => ({}),
      className: "",
      format: "YYYY-MM-DD",
      shouldReturnTimestamp: false,
      timestampFormat: "X"
    };
  }
  constructor(props, context) {
    super(props, context);
    const defaultDate = this.getDefaultValue(props);
    this.state = {
      date: defaultDate
    };
  }
  componentWillReceiveProps(newProps) {
    if (this.props.defaultValue !== newProps.defaultValue) {
      const defaultDate = this.getDefaultValue(newProps);
      this.setState({
        date: defaultDate
      });
    }
  }
  getDefaultValue = props => {
    const {
      shouldReturnTimestamp, 
      timestampFormat, 
      defaultValue, 
      format
    } = props;
    let date = null;
    if (defaultValue !== "") {
      if (shouldReturnTimestamp) {
        const timestamp = moment(defaultValue, timestampFormat);
        date = timestamp.isValid() ? timestamp : null;
      } else {
        const defaultDate = moment(defaultValue, format);
        date = defaultDate.isValid() ? defaultDate : null;
      }
    }
    return date;
  }
  handleChange = date => {
    this.setState({date}, () => {
      const {format, timestampFormat, shouldReturnTimestamp} = this.props;
      let newDate = "";
      if (date && shouldReturnTimestamp) {
        newDate = moment(date).format(timestampFormat);
      } else if (date) {
        newDate = moment(date).format(format);
      }
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
