import MenuRenderer from "./MenuRenderer";
import {Constants} from "./utils";

let INSTANCE_ID = 1;

export default class Select extends React.Component {
  static get propTypes() {
    return {
      noResultsText: PropTypes.string,
      labelKey: PropTypes.string.isRequired,
      optionClassName: PropTypes.string,
      optionRenderer: PropTypes.func,
      valueKey: PropTypes.string.isRequired,
      menuContainerStyle: PropTypes.object,
      menuStyle: PropTypes.object,
      instanceId: PropTypes.number,
      disabled: PropTypes.bool,
      multi: PropTypes.bool,
      closeOnSelect: PropTypes.bool,
      onSelectResetsInput: PropTypes.bool
    };
  }
  static get defaultProps() {
    return {
      noResultsText: "No Results Found!",
      labelKey: "label",
      valueKey: "value",
      multi: false,
      closeOnSelect: true,
      onSelectResetsInput: true
    };
  }
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    const {instanceId} = this.props;

    this._instancePrefix = `react-select-${instanceId || ++INSTANCE_ID}-`;
    this.focused = null;
  }

  focusOption = option => {
		this.setState({
			focusedOption: option
		});
  }
  
  handleInputValueChange
  addValue
  addValue = value => {
		var valueArray = this.getValueArray(this.props.value);
		const visibleOptions = this._visibleOptions.filter(val => !val.disabled);
		const lastValueIndex = visibleOptions.indexOf(value);
		this.setValue(valueArray.concat(value));
		if (visibleOptions.length - 1 === lastValueIndex) {
			// the last option was selected; focus the second-last one
			this.focusOption(visibleOptions[lastValueIndex - 1]);
		} else if (visibleOptions.length > lastValueIndex) {
			// focus the option below the selected one
			this.focusOption(visibleOptions[lastValueIndex + 1]);
		}
	}
  setValue

  selectValue (value) {
    const {closeOnSelect, multi, onSelectResetsInput} = this.props;
    const {inputValue, isFocused} = this.state;

    if (closeOnSelect) {
      this.hasScrolledToOption = false;
    }

    if (multi) {
      const updatedValue = onSelectResetsInput ? "" : inputValue;
      this.setState({
        focusedIndex: null,
        inputValue: this.handleInputValueChange(updatedValue),
        isOpen: !this.props.closeOnSelect
      }, () => this.addValue(value));
    } else {
      this.setState({
				inputValue: this.handleInputValueChange(""),
				isOpen: !this.props.closeOnSelect,
				isPseudoFocused: isFocused,
			}, () => {
				this.setValue(value);
			});
    }
	}

  getOptionLabel = option => {
    return option[this.props.labelKey];
  }

  onOptionRef = (ref, isFocused) => {
    if (isFocused) {
      this.focused = ref;
    }
  }

  handleMouseDownOnMenu = e => {
    const {disabled} = this.props;
    if (disabled || (e.type === "mousedown" && e.button !== Constants.ZERO)) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();

    this._openAfterFocus = true;
    this.focus();
  }

  renderMenuItems = (options, valueArray, focusedOption) => {
    let menuItems = null;
    
    const {noResultsText} = this.props;
    if (options && options.length) {
      const {labelKey, optionClassName, 
        optionRenderer, valueKey, multi} = this.props;
      menuItems = (
        <MenuRenderer 
          multi={ multi }
          focusedOption={ focusedOption }
          instancePrefix={ this._instancePrefix } 
          labelKey={ labelKey }
          onFocus={ this.focusOption }
          onSelect={ this.selectValue }
          optionClassName={ optionClassName }
          optionRenderer={ optionRenderer || this.getOptionLabel }
          options={ options }
          valueArray={ valueArray }
          valueKey={ valueKey }
          onOptionRef={ this.onOptionRef }
        />
      );
    }	else if (noResultsText) {
      menuItems = (
        <div className="Select-noresults">
          {noResultsText}
        </div>
      );
    }

    if (!menuItems) {
      return null;
    }

    const {menuContainerStyle, menuStyle} = this.props;

    return (
      <div
        ref={ ref => this.menuContainer = ref }
        className="Select-menu-outer"
        style={ menuContainerStyle }
      >
        <div
          ref={ ref => this.menu = ref }
          role="listbox"
          tabIndex={ -1 }
          className="Select-menu"
          id={ `${this._instancePrefix}-list` }
          style={ menuStyle }
          onMouseDown={ this.handleMouseDownOnMenu }
        >
          {menuItems}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderMenuItems}
      </div>
    );
  }
}
