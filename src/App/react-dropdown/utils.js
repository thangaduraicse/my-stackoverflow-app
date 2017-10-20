const Constants = {
  MINUS_ONE: -1,
  ZERO: 0,
  ONE: 1,
  KEYBOARD_KEY: {
    BACKSPACE: 8,
    ENTER: 13,
    ESCAPE: 27,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    UP:38,
    DOWN: 40,
    DELETE: 46
  }
};

function handleRequired(value, multi) {
  if (!value) {
    return true;
  }
  if (multi) {
    return value.length === Constants.ZERO;
  }
  return Object.keys(value).length === Constants.ZERO;
}

export {
  Constants,
  handleRequired
};
