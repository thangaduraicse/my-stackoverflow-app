import {Checkbox} from "react-bootstrap";
import classNames from "classnames";

export default class Option extends React.Component {
  static get propTypes() {
    return {
      children: PropTypes.node,
      className: PropTypes.string,
      instancePrefix: PropTypes.string.isRequired,
      isDisabled: PropTypes.bool,
      isFocused: PropTypes.bool,
      isSelected: PropTypes.bool,
      labelKey: PropTypes.string.isRequired,
      multi: PropTypes.bool,
      onFocus: PropTypes.func,
      onSelect: PropTypes.func,
      onUnfocus: PropTypes.func,
      option: PropTypes.object.isRequired,
      optionIndex: PropTypes.number,
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
		if(this.dragging) { 
      return;
    }
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
      optionIndex
    } = this.props;

    let className = classNames(this.props.className, option.className);
    
    if (multi) {
      if (option.disabled) {
        return (
          <div 
            role="menuitem"
            tabIndex={ optionIndex }
            className={ className }
            onMouseDown={ this.blockEvent }
            onClick={ this.blockEvent }
            onKeyUp={ this.blockEvent }
            onKeyPress={ this.blockEvent }
            onKeyDown={ this.blockEvent }
          >
            <Checkbox
              id={ `${instancePrefix}-option-${optionIndex}` }
              title={ option[labelKey] }
              checked={ option.checked }
              disabled
              readOnly
            >
              {children}
            </Checkbox>
          </div>
        );
      }
      return (
        <label 
          role="presentation"
          tabIndex={ optionIndex }
          style={ option.style }
          onMouseDown={ this.handleMouseDown }
          onMouseEnter={ this.handleMouseEnter }
          onMouseMove={ this.handleMouseMove }
          onTouchStart={ this.handleTouchStart }
          onTouchMove={ this.handleTouchMove }
          onTouchEnd={ this.handleTouchEnd }
          className={ className }
          htmlFor={ `${instancePrefix}-option-${optionIndex}` }
        >
          <input
            type="checkbox"
            id={ `${instancePrefix}-option-${optionIndex}` }
            checked={ option.checked }
            readOnly
          />
          {children}
        </label>
      );
    }

    if (option.disabled) {
      return (
        <div 
          role="menuitem"
          tabIndex={ optionIndex }
          id={ `${instancePrefix}-option-${optionIndex}` }
          className={ className }
          onMouseDown={ this.blockEvent }
          onClick={ this.blockEvent }
          onKeyUp={ this.blockEvent }
          onKeyPress={ this.blockEvent }
          onKeyDown={ this.blockEvent }
          title={ option[labelKey] }
        >
          {children}
        </div>
      );
    }

    return (
      <div 
        role="menuitem"
        tabIndex={ optionIndex }
        id={ `${instancePrefix}-option-${optionIndex}` }
        className={ className }
        style={ option.style }
        onMouseDown={ this.handleMouseDown }
        onMouseEnter={ this.handleMouseEnter }
        onMouseMove={ this.handleMouseMove }
        onTouchStart={ this.handleTouchStart }
        onTouchMove={ this.handleTouchMove }
        onTouchEnd={ this.handleTouchEnd }
        title={ option[labelKey] }
      >
        {children}
      </div>
    );
  }
}
