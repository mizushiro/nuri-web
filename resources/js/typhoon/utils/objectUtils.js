var objectUtils = {};

////////////////////////////////////////////////////////////////////////////////
// PUBLIC
////////////////////////////////////////////////////////////////////////////////

// undefined üũ
objectUtils.isUndefined = function() {
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] == null) {
      return true;
    }
    if (arguments[i] === undefined) {
      return true;
    }
    if (typeof arguments[i] === 'undefined') {
      return true;
    }
  }
  return false;
};

// undefined üũ
objectUtils.isEmptyArray = function() {
  for (var i = 0; i < arguments.length; i++) {
    var check = arguments[i];
    if (this.isUndefined(check)) {
      return true;
    }
    if (check.hasOwnProperty('length') == false) {
      return true;
    }
    if (check.length == 0) {
      return true;
    }
  }
  return false;
};

// floor
objectUtils.floor = function(val) {
  if (this.isUndefined(val)) {
    return 0;
  }
  return Math.floor(val);
}
