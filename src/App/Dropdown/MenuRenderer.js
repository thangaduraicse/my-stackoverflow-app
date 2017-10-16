import classNames from "classnames";
import Option from "./Option";

const negativeIndex = -1;

const MenuRenderer = props => {
  const {
    multi,
    focusedOption,
    instancePrefix,
    labelKey,
    onFocus,
    onSelect,
    optionClassName,
    options,
    valueArray,
    valueKey,
    optionRenderer,
    onOptionRef
  } = props;

  return options.map((option, index) => {
    let isSelected = valueArray && valueArray.indexOf(option) > negativeIndex;
    // we are playing with object reference. So, strict equality is enough to check
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
        instancePrefix={ instancePrefix }
        isFocused={ isFocused }
        key={ `option-${index}-${option[valueKey]}` }
        onFocus={ onFocus }
        onSelect={ onSelect }
        option={ option }
        index={ index }
        ref={ ref => { onOptionRef(ref, isFocused); } }
      >
        {optionRenderer(option, index)}
      </Option>
    );
  });
};

MenuRenderer.propTypes = {
  multi: PropTypes.bool,
  focusedOption: PropTypes.object,
  instancePrefix: PropTypes.string,
  labelKey: PropTypes.string,
  onFocus: PropTypes.func,
  onSelect: PropTypes.func,
  optionClassName: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  valueArray: PropTypes.arrayOf(PropTypes.object),
  valueKey: PropTypes.string.isRequired,
  onOptionRef: PropTypes.func.isRequired
};

MenuRenderer.defaultProps = {
  valueArray: [],
  options: [],
  valueKey: "value",
  onOptionRef: (ref, isFocused) => ({})
};

export default MenuRenderer;
