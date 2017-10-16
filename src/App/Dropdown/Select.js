import MenuRenderer from "./MenuRenderer";
import {Constants, handleRequired} from "./utils";

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
    this.state = {
			inputValue: "",
			isFocused: false,
			isOpen: false,
			isPseudoFocused: false,
			required: false,
		};
  }
  componentWillMount () {
    const {instanceId, value, required, multi} = this.props;

    this._instancePrefix = `react-select-${instanceId || ++INSTANCE_ID}-`;
    
    const valueArray = this.getValueArray(value);

		if (required) {
			this.setState({
				required: handleRequired(valueArray[0], multi)
			});
		}
  }
  
	componentDidMount () {
		if (this.props.autoFocus) {
			this.focus();
		}
	}

	componentWillReceiveProps (nextProps) {
		const valueArray = this.getValueArray(nextProps.value, nextProps);
    
    let {required} = this.state;

		if (nextProps.required) {
      required = handleRequired(valueArray[0], nextProps.multi);
		} else if (this.props.required) {
      required = false;
    }
    this.setState({required});
	}

	componentWillUpdate (nextProps, nextState) {
		if (nextState.isOpen !== this.state.isOpen) {
			this.toggleTouchOutsideEvent(nextState.isOpen);
		}
	}

	componentDidUpdate (prevProps, prevState) {
    if (this.menu && this.focused) {
      if (this.state.isOpen && !this.hasScrolledToOption) {
        let focusedOptionNode = ReactDOM.findDOMNode(this.focused);
        let menuNode = ReactDOM.findDOMNode(this.menu);
        menuNode.scrollTop = focusedOptionNode.offsetTop;
        this.hasScrolledToOption = true;
      } else if (!this.state.isOpen) {
        this.hasScrolledToOption = false;
      }

      if (this._scrollToFocusedOptionOnUpdate) {
        this._scrollToFocusedOptionOnUpdate = false;
        let focusedDOM = ReactDOM.findDOMNode(this.focused);
        let menuDOM = ReactDOM.findDOMNode(this.menu);
        let focusedRect = focusedDOM.getBoundingClientRect();
        let menuRect = menuDOM.getBoundingClientRect();
        if (focusedRect.bottom > menuRect.bottom) {
          menuDOM.scrollTop = (
            focusedDOM.offsetTop + focusedDOM.clientHeight - 
            menuDOM.offsetHeight
          );
        } else if (focusedRect.top < menuRect.top) {
          menuDOM.scrollTop = focusedDOM.offsetTop;
        }
      }
    }
    
		if (this.menuContainer) {
			let menuContainerRect = this.menuContainer.getBoundingClientRect();
			if (window.innerHeight < menuContainerRect.bottom) {
				window.scrollBy(
          Constants.ZERO, 
          menuContainerRect.bottom - window.innerHeight
        );
			}
    }
    
		if (prevProps.disabled !== this.props.disabled) {
			this.setState({isFocused: false}); // eslint-disable-line react/no-did-update-set-state
			this.closeMenu();
		}
	}

	componentWillUnmount () {
		if (!document.removeEventListener && document.detachEvent) {
			document.detachEvent("ontouchstart", this.handleTouchOutside);
		} else {
			document.removeEventListener("touchstart", this.handleTouchOutside);
		}
	}

	toggleTouchOutsideEvent (enabled) {
		if (enabled) {
			if (!document.addEventListener && document.attachEvent) {
				document.attachEvent("ontouchstart", this.handleTouchOutside);
			} else {
				document.addEventListener("touchstart", this.handleTouchOutside);
			}
		} else {
			if (!document.removeEventListener && document.detachEvent) {
				document.detachEvent("ontouchstart", this.handleTouchOutside);
			} else {
				document.removeEventListener("touchstart", this.handleTouchOutside);
			}
		}
	}

	handleTouchOutside = e => {
		// handle touch outside on ios to dismiss menu
		if (this.wrapper && !this.wrapper.contains(e.target)) {
			this.closeMenu();
		}
  }

  focus = () => {
		if (!this.input) return;
		this.input.focus();
	}

	blurInput = () => {
		if (!this.input) return;
		this.input.blur();
  }
  
  handleTouchMove = e => {
		this.dragging = true;
	}

	handleTouchStart = e => {
		this.dragging = false;
	}

	handleTouchEnd = e => {
		if (this.dragging) {
      return;
    }
		this.handleMouseDown(e);
	}

	handleTouchEndClearValue = e => {
		if (this.dragging) {
      return;
    }
		this.clearValue(e);
	}

	handleMouseDown = e => {
    if (
      this.props.disabled || 
      (e.type === "mousedown" && e.button !== Constants.ZERO)
    ) {
			return;
		}

		if (e.target.tagName === "INPUT") {
			return;
		}

		e.stopPropagation();
		e.preventDefault();

		if (!this.props.searchable) {
			this.focus();
			this.setState({
				isOpen: !this.state.isOpen,
			});
		}

		if (this.state.isFocused) {
			this.focus();

			let input = this.input;
			if (typeof input.getInput === "function") {
				input = input.getInput();
			}

			input.value = "";

			this.setState({
				isOpen: true,
				isPseudoFocused: false,
			});
		} else {
			this._openAfterFocus = true;
			this.focus();
		}
	}

	handleMouseDownOnArrow = e => {
    if (
      this.props.disabled || 
      (e.type === "mousedown" && e.button !== Constants.ZERO)
    ) {
			return;
		}
		if (!this.state.isOpen) {
			return;
		}
		e.stopPropagation();
		e.preventDefault();
		this.closeMenu();
  }
  
	closeMenu = () => {
    this.setState({
      isOpen: false,
      isPseudoFocused: this.state.isFocused && !this.props.multi,
      inputValue: ""
    });
		this.hasScrolledToOption = false;
	}

	handleInputFocus = e => {
		if (this.props.disabled) {
      return;
    }
    const isOpen = this.state.isOpen || this._openAfterFocus;
		this.setState({
			isFocused: true,
			isOpen: isOpen,
		});
		this._openAfterFocus = false;
	}

	handleInputBlur = e => {
    if (this.menu && 
      (this.menu === document.activeElement || 
        this.menu.contains(document.activeElement)
      )
    ) {
			this.focus();
			return;
		}
		this.setState({
      isFocused: false,
			isOpen: false,
      isPseudoFocused: false,
      inputValue: ""
    });
	}

	handleInputChange = e => {
		let newInputValue = e.target.value;

		this.setState({
			isOpen: true,
			isPseudoFocused: false,
			inputValue: newInputValue,
		});
  }
  
  // TODO
  handleKeyDown (event) {
		if (this.props.disabled) return;

		if (typeof this.props.onInputKeyDown === 'function') {
			this.props.onInputKeyDown(event);
			if (event.defaultPrevented) {
				return;
			}
		}

		switch (event.keyCode) {
			case 8: // backspace
				if (!this.state.inputValue && this.props.backspaceRemoves) {
					event.preventDefault();
					this.popValue();
				}
			return;
			case 9: // tab
				if (event.shiftKey || !this.state.isOpen || !this.props.tabSelectsValue) {
					return;
				}
				this.selectFocusedOption();
			return;
			case 13: // enter
				if (!this.state.isOpen) return;
				event.stopPropagation();
				this.selectFocusedOption();
			break;
			case 27: // escape
				if (this.state.isOpen) {
					this.closeMenu();
					event.stopPropagation();
				} else if (this.props.clearable && this.props.escapeClearsValue) {
					this.clearValue(event);
					event.stopPropagation();
				}
			break;
			case 38: // up
				this.focusPreviousOption();
			break;
			case 40: // down
				this.focusNextOption();
			break;
			case 33: // page up
				this.focusPageUpOption();
			break;
			case 34: // page down
				this.focusPageDownOption();
			break;
			case 35: // end key
				if (event.shiftKey) {
					return;
				}
				this.focusEndOption();
			break;
			case 36: // home key
				if (event.shiftKey) {
					return;
				}
				this.focusStartOption();
			break;
			case 46: // backspace
				if (!this.state.inputValue && this.props.deleteRemoves) {
					event.preventDefault();
					this.popValue();
				}
			return;
			default: return;
		}
		event.preventDefault();
	}

	handleValueClick (option, event) {
		if (!this.props.onValueClick) return;
		this.props.onValueClick(option, event);
	}

	handleRequired (value, multi) {
		if (!value) return true;
		return (multi ? value.length === 0 : Object.keys(value).length === 0);
	}

	// getOptionLabel (op) {
	// 	return op[this.props.labelKey];
	// }

	/**
	 * Turns a value into an array from the given options
	 * @param	{String|Number|Array}	value		- the value of the select input
	 * @param	{Object}		nextProps	- optionally specify the nextProps so the returned array uses the latest configuration
	 * @returns	{Array}	the value of the select represented in an array
	 */
	getValueArray (value, nextProps) {
		/** support optionally passing in the `nextProps` so `componentWillReceiveProps` updates will function as expected */
		const props = typeof nextProps === 'object' ? nextProps : this.props;
		if (props.multi) {
			if (typeof value === 'string') value = value.split(props.delimiter);
			if (!Array.isArray(value)) {
				if (value === null || value === undefined) return [];
				value = [value];
			}
			return value.map(value => this.expandValue(value, props)).filter(i => i);
		}
		var expandedValue = this.expandValue(value, props);
		return expandedValue ? [expandedValue] : [];
	}

	/**
	 * Retrieve a value from the given options and valueKey
	 * @param	{String|Number|Array}	value	- the selected value(s)
	 * @param	{Object}		props	- the Select component's props (or nextProps)
	 */
	expandValue (value, props) {
		const valueType = typeof value;
		if (valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') return value;
		let { options, valueKey } = props;
		if (!options) return;
		for (var i = 0; i < options.length; i++) {
			if (options[i][valueKey] === value) return options[i];
		}
	}

	setValue (value) {
		if (this.props.autoBlur) {
			this.blurInput();
		}
		if (this.props.required) {
			const required = this.handleRequired(value, this.props.multi);
			this.setState({ required });
		}
		if (this.props.onChange) {
			if (this.props.simpleValue && value) {
				value = this.props.multi ? value.map(i => i[this.props.valueKey]).join(this.props.delimiter) : value[this.props.valueKey];
			}
			this.props.onChange(value);
		}
	}


  focusOption = option => {
		this.setState({
			focusedOption: option
		});
  }
  
  addValue
  addValue = value => {
		let valueArray = this.getValueArray(this.props.value);
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
        inputValue: updatedValue,
        isOpen: !this.props.closeOnSelect
      }, () => this.addValue(value));
    } else {
      this.setState({
				inputValue: "",
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
