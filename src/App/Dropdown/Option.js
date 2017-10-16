import {MenuItem, Checkbox} from "react-bootstrap";
import classNames from "classnames";

export default class Option extends React.Component {
  static get propTypes() {
    return {
      labelKey: PropTypes.string.isRequired,
      instancePrefix: PropTypes.string,
      index: PropTypes.number.isRequired,
      multi: PropTypes.bool,
      className: PropTypes.string,
      isFocused: PropTypes.bool,
      option: PropTypes.object.isRequired,
      onFocus: PropTypes.func.isRequired,
      onSelect: PropTypes.func.isRequired,
      children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.arrayOf(PropTypes.node)
      ])
    };
  }
  static get defaultProps() {
    return {
      labelKey: "label",
      instancePrefix: "menu",
      multi: false,
      className: null,
      isFocused: false,
      option: {},
      onFocus: (option, event) => ({}),
      onSelect: (option, event) => ({}),
      children: null
    };
  }

  constructor(props, context) {
    super(props, context);
  }

  blockEvent = e => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleMouseDown = e => {
		e.preventDefault();
		e.stopPropagation();
		this.props.onSelect(this.props.option, e);
  }

	handleMouseEnter = e => {
		this.onFocus(e);
	}

	handleMouseMove = e => {
		this.onFocus(e);
	}

  handleTouchStart = e => {
		this.dragging = false;
	}
  
  handleTouchMove = e => {
		this.dragging = true;
  }

  handleTouchEnd = e => {
		if(this.dragging) return;

		this.handleMouseDown(e);
	}

	onFocus = e => {
		if (!this.props.isFocused) {
			this.props.onFocus(this.props.option, e);
		}
	}

  render() {
    const {
      multi, 
      option, 
      children, 
      labelKey, 
      instancePrefix,
      index
    } = this.props;

    let className = classNames(this.props.className, option.className);
    
    if (multi) {
      if (option.disabled) {
        return (
          <div
            id={ `${instancePrefix}-option-${index}` }
            className={ className }
          >
            <Checkbox
              title={ option[labelKey] }
              disabled={ option.disabled }
              checked={ option.checked }
            >
              <div
                role="menu"
                onMouseDown={ e => this.blockEvent(e) }
                onClick={ e => this.blockEvent(e) }
                onKeyUp={ e => this.blockEvent(e) }
                onKeyPress={ e => this.blockEvent(e) }
                onKeyDown={ e => this.blockEvent(e) }
                tabIndex={ index }
              >
                {children}
              </div>
            </Checkbox>
          </div>
        );
      }
      return (
        <div
          id={ `${instancePrefix}-option-${index}` }
          className={ className }
        >
          <Checkbox
            title={ option[labelKey] }
            checked={ option.checked }
          >
            <div
              role="menu"
              onMouseDown={ e => this.handleMouseDown(e) }
              onMouseEnter={ e => this.handleMouseEnter(e) }
              onMouseMove={ e => this.handleMouseMove(e) }
              onTouchStart={ e => this.handleTouchStart(e) }
              onTouchMove={ e => this.handleTouchMove(e) }
              onTouchEnd={ e => this.handleTouchEnd(e) }
              tabIndex={ index }
            >
              {children}
            </div>
          </Checkbox>
        </div>
      );
    }

    if (option.disabled) {
      return (
        <MenuItem
          id={ `${instancePrefix}-option-${index}` }
          className={ className }
          onMouseDown={ e => this.blockEvent(e) }
          onClick={ e => this.blockEvent(e) }
          disabled
        >
          {children}
        </MenuItem>
      );
    }

    return (
      <MenuItem
        id={ `${instancePrefix}-option-${index}` }
        className={ className }
        onMouseDown={ e => this.handleMouseDown(e) }
        onMouseEnter={ e => this.handleMouseEnter(e) }
        onMouseMove={ e => this.handleMouseMove(e) }
        onTouchStart={ e => this.handleTouchStart(e) }
        onTouchMove={ e => this.handleTouchMove(e) }
        onTouchEnd={ e => this.handleTouchEnd(e) }
        style={ option.style }
        title={ option[labelKey] }
      >
        {children}
      </MenuItem>
    );
  }
}
