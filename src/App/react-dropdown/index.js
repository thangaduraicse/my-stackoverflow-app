import classNames from "classnames";
import Option from "./Option";
import {Constants, handleRequired} from "./utils";
import "./index.scss";

let INSTANCE_ID = 1;

export default class Select extends React.Component {
  static get propTypes () {
    return {
      instanceId: PropTypes.number,
      value: PropTypes.any,
      required: PropTypes.bool,
      multi: PropTypes.bool,
      autoFocus: PropTypes.bool,
      disabled: PropTypes.bool,
      searchable: PropTypes.bool,
      onInputChange: PropTypes.func,
      labelKey: PropTypes.string.isRequired,
      valueKey: PropTypes.string.isRequired,
      pageSize: PropTypes.number,
      valueRenderer: PropTypes.func,
      placeholder: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string
      ]),
      showNumberOfItemsSelected: PropTypes.bool,
      multiSelectedText: PropTypes.string,
      inputProps: PropTypes.object,
      tabIndex: PropTypes.number,
      noResultsText: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string
      ]),
      optionClassName: PropTypes.string,
      optionRenderer: PropTypes.func,
      menuContainerStyle: PropTypes.object,
      menuStyle: PropTypes.object,
      wrapperStyle: PropTypes.object,
      style: PropTypes.object,
      className: PropTypes.string,
      clearAllText: PropTypes.string,
      clearValueText: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.object).isRequired,
      onChange: PropTypes.func.isRequired,
      simpleValue: PropTypes.bool,
      delimiter: PropTypes.string,
      filterOption: PropTypes.func
    };
  }
  static get defaultProps () {
    return {
      required: false,
      multi: false,
      autoFocus: false,
      disabled: false,
      searchable: false,
      labelKey: "label",
      valueKey: "value",
      pageSize: 5,
      placeholder: "Select an option...",
      showNumberOfItemsSelected: false,
      multiSelectedText: "Multiple Selected",
      inputProps: {},
      tabIndex: 0,
      noResultsText: "No results found",
      menuContainerStyle: {},
      menuStyle: {},
      wrapperStyle: {},
      style: {},
      clearAllText: "Clear All",
      clearValueText: "Clear Value",
      options: [],
      /* eslint-disable no-console */
      onChange: (value) => console.log("Selected value...", value),
      /* eslint-enable no-console */
      simpleValue: false,
      delimiter: ","
    };
  }
  constructor (props, context) {
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
    this._instancePrefix = `select-${instanceId || ++INSTANCE_ID}-`;
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
	componentWillReceiveProps (newProps) {
    const {required} = this.props;
    const {required: newRequired} = newProps;
		if (newRequired) {
      const {value, multi} = newProps;
      const valueArray = this.getValueArray(value, newProps);
			this.setState({
				required: handleRequired(valueArray[0], multi),
			});
		} else if (required) {
			this.setState({required: false});
		}
	}
	componentWillUpdate (nextProps, nextState) {
    const {isOpen} = this.state;
    const {isOpen: newIsOpen} = nextState;
    if (newIsOpen !== isOpen) {
      if (newIsOpen) {
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
	}
	componentDidUpdate (prevProps, prevState) {
    const {isOpen} = this.state;
    if (this.menu && this.focused && isOpen && !this.hasScrolledToOption) {
      const focusedOptionNode = ReactDOM.findDOMNode(this.focused);
			let menuNode = ReactDOM.findDOMNode(this.menu);
      menuNode.scrollTop = focusedOptionNode.offsetTop;
      this.hasScrolledToOption = true;
    } else if (!isOpen) {
      this.hasScrolledToOption = false;
    }
		if (this._scrollToFocusedOptionOnUpdate && this.focus && this.menu) {
      this._scrollToFocusedOptionOnUpdate = false;
			let focusedDOM = ReactDOM.findDOMNode(this.focused);
			let menuDOM = ReactDOM.findDOMNode(this.menu);
			const focusedRect = focusedDOM.getBoundingClientRect();
			const menuRect = menuDOM.getBoundingClientRect();
			if (focusedRect.bottom > menuRect.bottom) {
				menuDOM.scrollTop = (
          focusedDOM.offsetTop + focusedDOM.clientHeight - menuDOM.offsetHeight
        );
			} else if (focusedRect.top < menuRect.top) {
				menuDOM.scrollTop = focusedDOM.offsetTop;
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
    const {disabled} = this.props;
    const {disabled: prevDisabled} = prevProps;
		if (prevDisabled !== disabled) {
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
	handleTouchOutside = e => {
		if (this.wrapper && !this.wrapper.contains(e.target)) {
			this.closeMenu();
		}
	}
	focus = () => {
    if (this.input) {
      this.input.focus();
    }
  }
  handleTouchMove = e => {
		this.dragging = true;
	}
	handleTouchStart = e => {
		this.dragging = false;
	}
	handleTouchEnd = e => {
    if (!this.dragging) {
      this.handleMouseDown(e);
    }		
	}
	handleTouchEndClearValue = e => {
    if (!this.dragging) {
      this.clearValue(e);
    }		
	}
	handleMouseDown = e => {
    const {disabled, searchable} = this.props;
    if (disabled || (e.type === "mousedown" && e.button !== Constants.ZERO)) {
			return;
		}
		if (e.target.tagName === "INPUT") {
			return;
		}
		e.stopPropagation();
    e.preventDefault();
    const {isOpen, isFocused} = this.state;
		if (!searchable) {
			this.focus();
			this.setState({
				isOpen: !isOpen,
			});
		}
		if (isFocused) {
      this.focus();
      this.input.value = "";
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
    const {disabled} = this.props;
    const {isOpen} = this.state;
		if (disabled || (e.type === "mousedown" && e.button !== Constants.ZERO)) {
			return;
    }
		if (!isOpen) {
			return;
		}
		e.stopPropagation();
		e.preventDefault();
		this.closeMenu();
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
	closeMenu = () => {
    this.setState({
      isOpen: false,
      isPseudoFocused: this.state.isFocused && !this.props.multi,
      inputValue: this.handleInputValueChange("")
    });
		this.hasScrolledToOption = false;
	}
  handleInputFocus = e => {
    const {disabled} = this.props;
    if (disabled) {
      return;
    }
    let {isOpen} = this.state;
		isOpen = isOpen || this._openAfterFocus;
		this.setState({
			isFocused: true,
			isOpen: isOpen,
		});
		this._openAfterFocus = false;
  }
  handleInputBlur = e => {
    if (this.menu && (this.menu === document.activeElement || 
      this.menu.contains(document.activeElement))) {
			this.focus();
			return;
    }
    this.setState({
      isFocused: false,
			isOpen: false,
      isPseudoFocused: false,
      inputValue: this.handleInputValueChange("")
    });
	}
	handleInputChange = e => {
		let newInputValue = e.target.value;
		if (this.state.inputValue !== e.target.value) {
			newInputValue = this.handleInputValueChange(newInputValue);
		}
		this.setState({
			isOpen: true,
			isPseudoFocused: false,
			inputValue: newInputValue,
		});
	}
	handleInputValueChange = newValue => {
    const {onInputChange} = this.props;
    if (typeof onInputChange === "function") {
      let nextState = this.props.onInputChange(newValue);
      if (nextState !== null && typeof nextState !== "object") {
				newValue = "" + nextState;
			}
    }
    return newValue;
	}
	handleKeyDown = e => {
    const {disabled} = this.props;
		if (disabled) {
      return;
    }

    const {value, multi} = this.props;
    const {inputValue, isOpen} = this.state;

		switch (e.keyCode) {
			case Constants.KEYBOARD_KEY.BACKSPACE:
			case Constants.KEYBOARD_KEY.DELETE:
				if (!inputValue) {
					e.preventDefault();
					const valueArray = this.getValueArray(value);
					const valueArrayLength = valueArray.length;
					if (!valueArrayLength) {
						return;
					}
          this.setValue(multi ? valueArray.slice(
            Constants.ZERO, 
            valueArrayLength - Constants.ONE
          ) : null);
				}
			return;
			case Constants.KEYBOARD_KEY.ENTER:
				if (!isOpen) {
          return;
        }
        e.stopPropagation();
        if (this._focusedOption) {
          this.selectValue(this._focusedOption);
        }
			return;
			case Constants.KEYBOARD_KEY.ESCAPE:
				if (isOpen) {
					this.closeMenu();
					e.stopPropagation();
				} else {
					this.clearValue(e);
					e.stopPropagation();
				}
			break;
			case Constants.KEYBOARD_KEY.UP:
				this.focusAdjacentOption("previous");
			break;
			case Constants.KEYBOARD_KEY.DOWN:
				this.focusAdjacentOption("next");
			break;
			case Constants.KEYBOARD_KEY.PAGE_UP:
				this.focusAdjacentOption("page_up");
			break;
			case Constants.KEYBOARD_KEY.PAGE_DOWN:
				this.focusAdjacentOption("page_down");
			break;
			case Constants.KEYBOARD_KEY.END:
				if (e.shiftKey) {
					return;
				}
				this.focusAdjacentOption("end");
			break;
			case Constants.KEYBOARD_KEY.HOME:
				if (e.shiftKey) {
					return;
				}
				this.focusAdjacentOption("start");
			break;
			default: return;
		}
		e.preventDefault();
	}
  getOptionLabel = op => {
		const {searchable, labelKey} = this.props;
		const item = op[labelKey];
		if (searchable) {
			const {disabled} = this.props;
			const {inputValue} = this.state;
			const start = item.toLowerCase().indexOf(inputValue.toLowerCase()),
				end = start + inputValue.length;
			let part1 = item.slice(Constants.ZERO, start),
				part2 = item.slice(start, end),
				part3 = item.slice(end);
			if (disabled || op.disabled) {
				part1 = item;
				part2 = null;
				part3 = null;
			}
			return (
				<div>
					{part1}<b>{part2}</b>{part3}
				</div>
			);
		}
		return item;
  }
  getValueArray = (value, nextProps) => {
		const props = typeof nextProps === "object" ? nextProps : this.props;
		if (props.multi) {
			if (typeof value === "string") value = value.split(props.delimiter);
			if (!Array.isArray(value)) {
				if (!value) {
          return [];
        }
				value = [value];
			}
			return value.map(value => this.expandValue(value, props)).filter(i => i);
		}
		let expandedValue = this.expandValue(value, props);
		return expandedValue ? [expandedValue] : [];
	}
  expandValue = (value, props) => {
		const valueType = typeof value;
    if (valueType !== "string" && valueType !== "number" && 
      valueType !== "boolean") {
      return value;
    }
		let {options, valueKey} = props;
		if (options.length) {
      for (let i = 0; i < options.length; i++) {
        if (options[i][valueKey] === value) {
          return options[i];
        }
      }
    }
  }
  selectValue = value => {
    const {multi} = this.props;
    if (multi) {
      this.setState({
				focusedIndex: null,
				inputValue: this.handleInputValueChange(""),
				isOpen: true,
			}, () => {
				const valueArray = this.getValueArray(this.props.value);
				const visibleOptions = this._visibleOptions.filter(op => !op.disabled);
				const lastValueIndex = visibleOptions.indexOf(value);
				const lastValueArrayIndex = valueArray.indexOf(value);
				if (lastValueArrayIndex > Constants.MINUS_ONE) {
					valueArray.splice(lastValueArrayIndex, Constants.ONE);
					this.setValue(valueArray);
				} else {
					this.setValue(valueArray.concat(value));
				}
				if (visibleOptions.length - Constants.ONE === lastValueIndex) {
					this.focusOption(visibleOptions[lastValueIndex - Constants.ONE]);
				} else if (visibleOptions.length > lastValueIndex) {
					this.focusOption(visibleOptions[lastValueIndex + Constants.ONE]);
				}
			});
    } else {
      this.hasScrolledToOption = false;
			this.setState({
				inputValue: this.handleInputValueChange(""),
				isOpen: false,
				isPseudoFocused: this.state.isFocused,
			}, () => {
				this.setValue(value);
			});
    }
  }
  setValue = value => {
    const {multi, required, onChange, simpleValue, 
      delimiter, valueKey} = this.props;
		if (required) {
			const required = handleRequired(value, multi);
			this.setState({required});
		}
		if (typeof onChange === "function") {
			if (simpleValue && value) {
        value = multi ? value.map(i => i[valueKey]).join(delimiter) : 
          value[valueKey];
			}
			onChange(value);
		}
  }
  clearValue = e => {
		if (e && e.type === "mousedown" && e.button !== Constants.ZERO) {
			return;
		}
		e.stopPropagation();
		e.preventDefault();
		this.setValue(this.props.multi ? [] : null);
		this.setState({
			isOpen: false,
			inputValue: this.handleInputValueChange(""),
		}, this.focus);
	}
  focusOption = option => {
		this.setState({
			focusedOption: option
		});
	}
	focusAdjacentOption = dir => {
    const options = this._visibleOptions
      .map((option, index) => ({option, index}))
      .filter(option => !option.option.disabled);
    this._scrollToFocusedOptionOnUpdate = true;
    
    const optionsLen = options.length;
		if (!this.state.isOpen) {
      const index = dir === "next" ? Constants.ZERO : 
        (optionsLen - Constants.ONE);
			this.setState({
				isOpen: true,
				inputValue: "",
        focusedOption: this._focusedOption || 
          (optionsLen ? options[index].option : null)
			});
			return;
    }
    if (!optionsLen) {
      return;
    }
		let focusedIndex = -1;
		for (let i = 0; i < options.length; i++) {
			if (this._focusedOption === options[i].option) {
				focusedIndex = i;
				break;
			}
		}
		if (dir === "next" && focusedIndex !== Constants.MINUS_ONE ) {
			focusedIndex = (focusedIndex + Constants.ONE) % options.length;
		} else if (dir === "previous") {
			if (focusedIndex > Constants.ZERO) {
				focusedIndex -= Constants.ONE;
			} else {
				focusedIndex = options.length - Constants.ONE;
			}
		} else if (dir === "start") {
			focusedIndex = Constants.ZERO;
		} else if (dir === "end") {
			focusedIndex = options.length - Constants.ONE;
		} else if (dir === "page_up") {
			const potentialIndex = focusedIndex - this.props.pageSize;
			if (potentialIndex < Constants.ZERO) {
				focusedIndex = Constants.ZERO;
			} else {
				focusedIndex = potentialIndex;
			}
		} else if (dir === "page_down") {
			const potentialIndex = focusedIndex + this.props.pageSize;
			if (potentialIndex > options.length - Constants.ONE) {
				focusedIndex = options.length - Constants.ONE;
			} else {
				focusedIndex = potentialIndex;
			}
		}

		if (focusedIndex === Constants.MINUS_ONE) {
			focusedIndex = Constants.ZERO;
		}

		this.setState({
			focusedIndex: options[focusedIndex].index,
			focusedOption: options[focusedIndex].option
		});
  }
  renderValue = valueArray => {
    if (!valueArray.length) {
			return !this.state.inputValue ? (
        <div className="Select-placeholder">
          {this.props.placeholder}
        </div>
       ) : null;
    }
    if (!this.state.inputValue) {

      const {multi, labelKey} = this.props;   
      let contentTitle = null, valueContentEle = null;

      if (multi && valueArray.length > Constants.ONE) {
        const {showNumberOfItemsSelected, multiSelectedText} = this.props;
        if (showNumberOfItemsSelected) {
          valueContentEle = `${valueArray.length} ${multiSelectedText}`;
        } else {
          valueContentEle = multiSelectedText;
        }
        contentTitle = valueContentEle;
      } else {
        const {valueRenderer} = this.props;
        const renderLabel = valueRenderer || this.getOptionLabel;
        valueContentEle = renderLabel(valueArray[0]);
        contentTitle = valueArray[0][labelKey];
      }
      return (
        <div className="Select-value">
          <span
            className="Select-value-label"
            aria-selected="true"
            id={ this._instancePrefix + "-value-item" }
            title={ contentTitle }
          >
            {valueContentEle}
          </span>
        </div>
      );
    }
    return null;
	}
	renderInput = valueArray => {
		const {inputProps, disabled, searchable} = this.props;
		const className = classNames("Select-input", inputProps.className);

		if (disabled || !searchable) {
			return (
        <div
          { ...inputProps }
          className={ className }
          tabIndex={ this.props.tabIndex }
          onBlur={ this.handleInputBlur }
          onFocus={ this.handleInputFocus }
          ref={ ref => this.input = ref }
          style={ {border: 0, width: 1, display:"inline-block"} }
        />
			);
		}
		return (
			<div className={ className } key="input-wrap">
        <input
          { ...inputProps }
          className={ className }
          tabIndex={ this.props.tabIndex }
          onBlur={ this.handleInputBlur }
          onChange={ this.handleInputChange }
          onFocus={ this.handleInputFocus }
          ref={ ref => this.input = ref }
          required={ this.state.required }
          value={ this.state.inputValue }
        />
			</div>
		);
  }
  onOptionRef = (ref, isFocused) => {
		if (isFocused) {
			this.focused = ref;
		}
  }
  renderMenuItems = (options, valueArray, focusedOption) => {
    let menuItems = null;
    
    const {noResultsText} = this.props;
    if (options && options.length) {
      const {labelKey, optionClassName, valueKey, multi} = this.props;
      
      let optionRenderer = this.props.optionRenderer || this.getOptionLabel;

      menuItems = options.map((option, index) => {
        let isSelected = valueArray && 
          valueArray.indexOf(option) > Constants.MINUS_ONE;
        
        let isFocused = option === focusedOption;
        
        let optionClass = classNames(optionClassName, {
          "Select-option": true,
          "is-selected": isSelected,
          "is-focused": isFocused,
          "is-disabled": option.disabled,
        });
        return (
          <Option
            labelKey={ labelKey }
            multi={ multi }
            className={ optionClass }
            instancePrefix={ this._instancePrefix }
            isFocused={ isFocused }
            key={ `option-${index}-${option[valueKey]}` }
            onFocus={ this.focusOption }
            onSelect={ this.selectValue }
            option={ option }
            index={ index }
            selected={ isSelected }
            ref={ ref => this.onOptionRef(ref, isFocused) }
          >
            {optionRenderer(option, index)}
          </Option>
        );
      });
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
  getFocusableOptionIndex = selectedOption => {
    const options = this._visibleOptions;
    if (options.length) {
      const valueKey = this.props.valueKey;
      let focusedOption = this.state.focusedOption || selectedOption;
      if (focusedOption && !focusedOption.disabled) {
        let focusedOptionIndex = -1;
        options.some((option, index) => {
          const isOptionEqual = option[valueKey] === focusedOption[valueKey];
          if (isOptionEqual) {
            focusedOptionIndex = index;
          }
          return isOptionEqual;
        });
        if (focusedOptionIndex !== Constants.MINUS_ONE) {
          return focusedOptionIndex;
        }
      }
      for (let i = 0; i < options.length; i++) {
        if (!options[i].disabled) {
          return i;
        }
      }
    }
    return null;		
  }
  getFilterOptions = () => {
    let {inputValue} = this.state;
    const {options} = this.props;

    if (options.length) {
      const {valueKey, labelKey, filterOption} = this.props;
      inputValue = inputValue.toLowerCase();
      return options.filter(option => {
        if (typeof filterOption === "function") {
          return filterOption(option, inputValue);
        }
        if (!inputValue) {
          return true;
        }
        const valueTest = String(option[valueKey]).toLowerCase();
        const labelTest = String(option[labelKey]).toLowerCase();
    
        return (
          valueTest.indexOf(inputValue) >= Constants.ZERO ||
          labelTest.indexOf(inputValue) >= Constants.ZERO
        );
      });
    }
    return [];
  }
  render () {
    const {value, multi, disabled, clearAllText, clearValueText} = this.props;
    const {tabIndex, searchable, wrapperStyle, style} = this.props;
    let {isOpen, inputValue, isFocused, isPseudoFocused} = this.state;

    const valueArray = this.getValueArray(value);
    const options = this._visibleOptions = this.getFilterOptions();

    if (multi && !options.length && valueArray.length && !inputValue) {
      isOpen = false;
    }

    const focusedOptionIndex = this.getFocusableOptionIndex(valueArray[0]);
    let focusedOption = null;
    if (focusedOptionIndex !== null) {
      focusedOption = this._focusedOption = options[focusedOptionIndex];
    } else {
      focusedOption = this._focusedOption = null;
    }

    const className = classNames("Select", this.props.className, {
      "is-disabled": disabled,
      "is-focused": isFocused,
      "is-open": isOpen,
      "is-pseudo-focused": isPseudoFocused,
      "is-searchable": searchable,
      "has-value": valueArray.length
    });

    return (
      <div 
        ref={ ref => this.wrapper = ref }
        className={ className }
        style={ wrapperStyle }
      >
        <div 
          role="button"
          ref={ ref => this.control = ref }
          className="Select-control"
          style={ style }
          onKeyDown={ this.handleKeyDown }
          onMouseDown={ this.handleMouseDown }
          onTouchEnd={ this.handleTouchEnd }
          onTouchStart={ this.handleTouchStart }
          onTouchMove={ this.handleTouchMove }
          tabIndex={ tabIndex }
        >
          <span 
            className="Select-multi-value-wrapper" 
            id={ this._instancePrefix + "-value" }
          >
            {this.renderValue(valueArray)}
            {this.renderInput(valueArray)}
          </span>
          {
            !value || disabled || (multi && !value.length) ? null : (
              <span
                role="button"
                className="Select-clear-zone"
                title={ multi ? clearAllText : clearValueText }
                onMouseDown={ this.clearValue }
                onTouchStart={ this.handleTouchStart }
                onTouchMove={ this.handleTouchMove }
                onTouchEnd={ this.handleTouchEndClearValue }
                tabIndex="-1"
              >
                <span className="Select-clear">&times;</span>
              </span>
            )
          }
          <span 
            role="button"
            className="Select-arrow-zone" 
            onMouseDown={ this.handleMouseDownOnArrow }
            tabIndex="-1"
          >
            <span className="Select-arrow" />
          </span>
        </div>
        {
          isOpen ? this.renderMenuItems(options, valueArray, focusedOption) : 
            null
        }
      </div>
    );
  }
}
