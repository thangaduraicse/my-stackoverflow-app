const Constants = {
  ZERO: 0
};

const filterOptions = (options, filterValue, props) => {
  const {valueKey, labelKey, filterOption} = props;

  filterValue = filterValue.toLowerCase();
  
  return options.filter(option => {
    if (filterOption) {
      return filterOption.call(this, option, filterValue);
    }
    if (!filterValue) {
      return true;
    }
    const valueTest = String(option[valueKey]).toLowerCase();
    const labelTest = String(option[labelKey]).toLowerCase();

    return (
      valueTest.indexOf(filterValue) >= Constants.ZERO ||
      labelTest.indexOf(filterValue) >= Constants.ZERO
    );
  });
};

const handleRequired = (value, multi) => {
  if (!value) return true;
  return (
    multi ? value.length === Constants.ZERO : 
      Object.keys(value).length === Constants.ZERO
  );
};

export {
  Constants,
  filterOptions,
  handleRequired
};
