/*
 * draft.js - A lightweight library for parametric design
 * version v0.2.0
 * http://draft.js.org
 *
 * copyright Jordi Pakey-Rodriguez <me@jordi.codes>
 * license MIT
 *
 * BUILT: Sat Feb 27 2016 03:30:18 GMT-0600 (CST)
 */

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.draft = factory();
  }
}(this, function() {
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var draft = function draft(name) {
  return draft.doc(name);
};

// Initialize types and mixins
draft.types = {};
draft.mixins = {};
draft.transforms = {};

// TODO: prefer operators at beginning of lines?

// TODO: come up with a better location/interface for createTransform()
draft.createTransform = function createTransform(name) {
  var mixin = _defineProperty({}, name, Object.defineProperty(function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.transform.apply(this, [name].concat(args));
  }, 'name', {
    configurable: true,
    value: name
  }));

  return mixin[name];
};

// These methods are adapted from Oliver Caldwell's Heir script, which he has
// released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/Heir

draft.inherit = function inherit(destination, source, properties) {
  destination.prototype = Object.create(source.prototype, properties);
  destination.prototype.constructor = destination;
  // destination._super = source.prototype;
};

draft.mixin = function mixin(destination, source) {
  if (Array.isArray(source)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = source[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var val = _step.value;

        draft.mixin(destination, val);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if (typeof source == 'string') {
    draft.mixin(destination, draft.mixins[source]);
  } else if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) == 'object') {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        destination.prototype[key] = source[key];
      }
    }
  }
};

// Fallback proxy function for non-ES6 browsers
draft.proxy = function proxy(obj) {
  return obj;
};

// TODO: configurable defaults
draft.defaults = draft.proxy({
  get dpi() {
    var test = document.createElement('div');
    test.style.width = '1in';
    test.style.padding = 0;
    document.getElementsByTagName('body')[0].appendChild(test);

    var dpi = test.offsetWidth;

    document.getElementsByTagName('body')[0].removeChild(test);

    // Fall back to standard 96dpi resolution
    return dpi || 96;
  }
});

draft.types.Float = (function () {
  function Float(value) {
    _classCallCheck(this, Float);

    this.value = parseFloat(value);
  }

  _createClass(Float, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.value;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'float';
    }
  }, {
    key: 'regex',
    get: function get() {
      // Matches all floating point values. Should match:
      // 123
      // -123.45
      // 123e5
      // 123.45E+5
      return '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?';
    }
  }]);

  return Float;
})();

draft.types.float = function float(value) {
  return value == undefined ? value : new draft.types.Float(value);
};

draft.defaults.unit = 'px';

// TODO: make type, regex, units, and test static
draft.types.Length = (function (_draft$types$Float) {
  _inherits(Length, _draft$types$Float);

  function Length(value, unit) {
    _classCallCheck(this, Length);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Length).call(this, value));

    value = _this.test(value);
    unit = _this.test(unit);

    if (!isNaN(_this.value) && (value || unit)) {
      _this.unit = value || unit;
      _this.convert(unit);
    } else {
      _this.unit = draft.defaults.unit;
    }
    return _this;
  }

  _createClass(Length, [{
    key: 'test',
    value: function test(val) {
      // TODO: strict match anchor (^ instead of word end)
      val = new RegExp(this.regex + '$', 'i').exec(val);
      return val ? val[0].toLowerCase() : false;
    }
  }, {
    key: 'convert',
    value: function convert(newUnit) {
      var _this2 = this;

      newUnit = this.test(newUnit);

      if (!newUnit) {
        return false;
      }

      var chain = function chain(unit, reverse) {
        var units = _this2.units[unit];

        _this2.value *= reverse ? units[1] : units[0];
        _this2.value /= reverse ? units[0] : units[1];

        return units[2];
      };

      var unit = this.unit;
      while (unit !== newUnit && unit !== 'px') {
        unit = chain(unit);
      }

      if (unit !== newUnit) {
        unit = newUnit;
        while (unit !== 'px') {
          unit = chain(unit, true);
        }
      }

      this.unit = newUnit;

      return this.toString();
    }
  }, {
    key: 'valueOf',
    value: function valueOf() {
      // TODO: use px instead of draft.defaults.unit?
      return new Length(this.toString(), draft.defaults.unit).value;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.value + this.unit;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'length';
    }
  }, {
    key: 'regex',
    get: function get() {
      return '(px|pt|pc|in|ft|yd|mi|mm|cm|dm|km|m)';
    }
  }, {
    key: 'units',
    get: function get() {
      return {
        px: [1, 1, 'px'],
        pt: [1, 72, 'px'],
        pc: [12, 1, 'pt'],
        in: [draft.defaults.dpi, 1, 'px'],
        ft: [12, 1, 'in'],
        yd: [3, 1, 'ft'],
        mi: [1760, 1, 'yd'],
        mm: [1, 25.4, 'in'],
        cm: [10, 1, 'mm'],
        dm: [10, 1, 'cm'],
        m: [10, 1, 'dm'],
        km: [1000, 1, 'm']
      };
    }
  }]);

  return Length;
})(draft.types.Float);

draft.types.length = function length(value, unit) {
  return value == undefined ? value : new draft.types.Length(value, unit);
};

draft.types.Color = (function () {
  function Color(color) {
    _classCallCheck(this, Color);

    color = new RegExp('^(?:' + this.regex + ')$', 'i').exec(isNaN(color) ? color : color.toString(16));

    if (color !== null) {
      this.color = color[0].toLowerCase();

      for (var i = 1; i <= 3; i++) {
        color[i] = parseInt(color[i] || parseInt(color[i + 3] || color[i + 6].repeat(2), 16), 10);
      }

      this.red = color[1];
      this.green = color[2];
      this.blue = color[3];
    }
  }

  _createClass(Color, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.red << 16 | this.green << 8 | this.blue;
    }
  }, {
    key: 'toString',
    value: function toString() {
      return this.color;
    }
  }, {
    key: 'type',
    get: function get() {
      return 'color';
    }
  }, {
    key: 'regex',
    get: function get() {
      var rgbColor = '([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])';
      var rgb = 'rgb\\(' + rgbColor + ', ?' + rgbColor + ', ?' + rgbColor + '\\)';

      var hexColor = '([0-9a-f]{2})'.repeat(3);
      var hex = '#?(?:' + hexColor + '|' + hexColor.replace(/\{2\}/g, '') + ')';
      // var hex = '#?(?:[0-9a-f]{3}){1,2}';

      return rgb + '|' + hex;
    }
  }]);

  return Color;
})();

draft.types.color = function color(value) {
  return value == undefined ? value : new draft.types.Color(value);
};

// These methods are adapted from Oliver Caldwell's EventEmitter library, which
// he has released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/EventEmitter

draft.mixins.event = {
  on: function on(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];

      if (!(listeners.map(function (l) {
        return l.listener;
      }).indexOf(listener) !== -1)) {
        listeners.push((typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) == 'object' ? listener : {
          listener: listener,
          once: false
        });
      }
    }

    return this;
  },
  once: function once(evt, listener) {
    return this.on(evt, {
      listener: listener,
      once: true
    });
  },
  off: function off(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var index = listeners.map(function (l) {
        return l.listener;
      }).lastIndexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }

    return this;
  },

  // TODO: use rest for args (...args)
  fire: function fire(evt, args) {
    // Put args in an array if it isn't already one
    if (!Array.isArray(args)) {
      args = [args];
    }

    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var i = listeners.length;

      /* if (i > 0) {
        console.info(`${this.domID} ${key}:`, args.map(arg => String(arg)));
      } */

      while (i--) {
        var listener = listeners[i];
        var response = listener.listener.apply({
          target: this,
          timeStamp: Date(),
          type: key
        }, args);

        // If the listener returns 'off' then it gets removed from the event
        if (listener.once === true || response === 'off') {
          this.off(evt, listener.listener);
        }
      }
    }

    return this;
  },
  defineEvent: function defineEvent() {
    for (var _len2 = arguments.length, evts = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      evts[_key2] = arguments[_key2];
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = evts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var evt = _step2.value;

        this.getListeners(evt);
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return this;
  },
  removeEvent: function removeEvent(evt) {
    var events = this._getEvents();

    // Remove different things depending on the state of evt
    if (typeof evt == 'string') {
      // Remove all listeners for the specified event
      delete events[evt];
    } else if (evt instanceof RegExp) {
      // Remove all events matching the regex.
      for (var key in events) {
        if (evt.test(key)) {
          delete events[key];
        }
      }
    } else {
      // Remove all listeners in all events
      delete this._events;
    }

    return this;
  },
  getListeners: function getListeners(evt, map) {
    var events = this._getEvents();
    var listeners = {};

    // Return a concatenated array of all matching events if
    // the selector is a regular expression.
    if (evt instanceof RegExp) {
      for (var key in events) {
        if (evt.test(key)) {
          listeners[key] = events[key];
        }
      }
    } else {
      var listener = events[evt] || (events[evt] = []);

      if (map === undefined) {
        listeners = listener;
      } else {
        listeners[evt] = listener;
      }
    }

    /* if (map !== undefined) {
      listeners = Object.keys(listeners).map(key => listeners[key]);
    } */

    return listeners;
  },

  /**
   * Fetches the events object and creates one if required.
   *
   * @return {Object} The events storage object.
   * @api private
   */
  _getEvents: function _getEvents() {
    return this._events || (this._events = {});
  }
};

draft.mixins.transform = {
  transform: function transform(_transform) {
    var obj = {
      transform: _transform,
      args: {}
    };
    _transform = draft.transforms[_transform];

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    for (var arg in args) {
      var prop = _transform.args[arg];
      obj.args[prop] = args[arg];

      if (this.map.indexOf(prop) !== -1) {
        var val = _transform.transform.call(this, prop, args[arg]);
        this.prop(prop, val);
      }
    }

    this.transforms.push(obj);
    this.fire('transform:' + obj.transform, obj);

    return this;
  }
};

draft.transforms.translate = {
  args: ['x', 'y', 'z'],
  transform: function transform(prop, val) {
    val = draft.types.length(val || 0);
    return draft.types.length((this.prop(prop) || 0) + val, this.unit());
  }
};

draft.transforms.position = {
  args: draft.transforms.translate.args,
  transform: function transform(prop, val) {
    return draft.types.length(val || 0, this.unit());
  }
};

draft.mixins.translate = {
  translate: draft.createTransform('translate'),
  position: draft.createTransform('position')
};

draft.transforms.rotate = {
  args: ['alpha', 'beta', 'gamma', 'order'],
  transform: function transform(prop, val) {
    val = draft.types.angle(val || 0);
    return draft.types.angle((this.prop(prop) || 0) + val, this.defaults.angle);
  }
};

draft.transforms.orientation = {
  args: draft.transforms.rotate.args,
  transform: function transform(prop, currVal, val) {
    return draft.types.angle(val || 0, this.defaults.angle);
  }
};

draft.mixins.rotate = {
  rotate: draft.createTransform('rotate'),
  orientation: draft.createTransform('orientation')
};

draft.transforms.scale = {
  args: ['width', 'height', 'length'],
  transform: function transform(prop, val) {
    val = parseFloat(val) || 1;
    return draft.types.length((this.prop(prop) || 0) * val, this.unit());
  }
};

draft.transforms.size = {
  args: draft.transforms.scale.args,
  transform: function transform(prop, val) {
    return draft.types.length(val || 0, this.unit());
  }
};

draft.mixins.scale = {
  scale: draft.createTransform('scale'),
  size: draft.createTransform('size')
};

draft.transforms.skew = {
  args: ['skewX', 'skewY', 'skewZ'],
  transform: function transform(prop, val) {
    return parseFloat(val) || 0;
  }
};

draft.mixins.skew = {
  skew: draft.createTransform('skew')
};

draft.mixins.system = {
  // Cartesian:
  // - page.system('cartesian')
  // - (x, y)
  // - x is right, y is up, z is out of the page (right-hand)
  // - global origin (0, 0) is at bottom-left
  //
  // Polar:
  // - page.system('polar')
  // - (r, φ)
  // - φ is counter-clockwise, with 0 pointing to the right
  // - global pole (0, 0) is at center
  //
  // BACKLOG:30 remove svg coordinates?
  // Web/SVG:
  // - page.system('web')
  // - (x, y)
  // - x is right, y is down, z is out of the page (left-hand)
  // - global origin (0, 0) is at top-left

  // BACKLOG:10 switch φ for θ?
  // BACKLOG:0 Spherical (ρ, θ, φ), Cylindrical (ρ, φ, z)

  system: function system(_system) {
    /* if (this.prop('system') != system) {
      // BACKLOG:20 recursively convert all elements to new system?
    } */
    return this.prop('system', _system);
  }
};

draft.defaults.system = 'cartesian';

draft.mixins.fill = {
  // TODO: combine color and opacity into fill()

  fill: function fill(color) {
    return this.fillColor(color);
  },
  fillColor: function fillColor(color) {
    return this.prop('fill.color', draft.types.color(color));
  },
  fillOpacity: function fillOpacity(opacity) {
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('fill.opacity', opacity);
  }
};

draft.defaults['fill.color'] = '#fff';
draft.defaults['fill.opacity'] = 0;

draft.mixins.stroke = {
  // TODO: combine color, opacity, and width into stroke()

  stroke: function stroke(color) {
    return this.strokeColor(color);
  },
  strokeColor: function strokeColor(color) {
    return this.prop('stroke.color', draft.types.color(color));
  },
  strokeOpacity: function strokeOpacity(opacity) {
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('stroke.opacity', opacity);
  },
  strokeWidth: function strokeWidth(width) {
    return this.prop('stroke.width', draft.types.length(width));
  }
};

draft.defaults['stroke.color'] = '#000';
draft.defaults['stroke.opacity'] = 1;
draft.defaults['stroke.width'] = 1;

// let _type = new WeakMap();
// let _id = new WeakMap();

draft.Element = (function () {
  function Element(name) {
    _classCallCheck(this, Element);

    // Make sure _metadata and _properties are initialized
    this._metadata = {
      name: name
    };
    this._properties = {};
    this.transforms = [];

    // HACK:0 use this.constructor.name to get an element's type. Requires all
    // subclasses to have a defined constructor.
    for (var type in draft) {
      if (this.constructor === draft[type]) {
        this._type = type.toLowerCase();
        // _type.set(this, type.toLowerCase());
        break;
      }
    }
    if (!this._type) {
      this._type = this.constructor.name;
    }
  }

  /* static inherit(source, addSuper) {
    draft.inherit(this, source, addSuper);
  } */

  _createClass(Element, [{
    key: 'prop',
    value: function prop(_prop, val) {
      if (_prop === undefined) {
        // Act as a full properties getter if prop is undefined
        return this._properties;
      } else if (_prop === null) {
        // Delete all properties if prop is null
        this._properties = {};
      } else if (typeof _prop == 'string') {
        var props = draft.proxy(this._properties);

        if (val === undefined) {
          // Act as an individual property getter if val is undefined
          // TODO: do a fuzzy-find? For example, el.prop('width') would match
          // el._properties.size.width if el._properties.width is undefined
          return _prop in props ? props[_prop] : null;
        } else if (val === null) {
          // Delete the property if val is null
          delete props[_prop];
          this.fire('change', [_prop, val]);
        } else if (props[_prop] !== val) {
          // Act as an individual property setter if both prop and val are defined

          // TODO: let properties be objects (don't stringify)
          if (val.type === 'color') {
            val = String(val);
          }

          props[_prop] = val;
          this.fire('change', [_prop, val]);
        }
      } else if ((typeof _prop === 'undefined' ? 'undefined' : _typeof(_prop)) == 'object') {
        // Act as a getter if prop is an object with only null values.
        // Act as a setter if prop is an object with at least one non-null value.
        var setter = false;

        for (var p in _prop) {
          // Get this._properties[p] and save it to prop[p]
          _prop[p] = this.prop(p, _prop[p]);
          // If the returned value is an object, prop[p] is non-null, so act like
          // a setter.
          setter = setter || _typeof(_prop[p]) == 'object';
        }

        return setter ? this : _prop;
      }

      // Chainable if 'this' is returned
      return this;
    }

    // Get/set the element's default length unit

  }, {
    key: 'unit',
    value: function unit(_unit) {
      return this.prop('unit', _unit);
    }

    // TODO: use rest (...blacklist) for multiple blacklist items?

  }, {
    key: 'stringify',
    value: function stringify(blacklist) {
      var replacer;

      if (Array.isArray(blacklist)) {
        replacer = function (key, val) {
          if (blacklist.indexOf(key) !== -1) {
            return undefined;
          }

          return val;
        };
      } else if (blacklist instanceof RegExp) {
        replacer = function (key, val) {
          if (blacklist.test(key)) {
            return undefined;
          }

          return val;
        };
      }

      return JSON.stringify(this, replacer, 2);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        type: this.type,
        id: this.id,
        properties: this.prop(),
        children: this.children
      };
    }
  }, {
    key: 'type',
    get: function get() {
      return this._type;
      // return _type.get(this);
    }
  }, {
    key: 'id',
    get: function get() {
      return this._id;
      // return _id.get(this);
    }

    // Construct a unique ID from the element's type and ID

  }, {
    key: 'domID',
    get: function get() {
      var id = String(this.id);

      // TODO: make the domID digit length configurable
      return this.type + '_' + '0'.repeat(Math.max(4 - id.length, 0)) + id;
    }
  }, {
    key: 'meta',
    get: function get() {
      return this._metadata;
    }
  }], [{
    key: 'extend',
    value: function extend(name, config, parent) {
      var Class = (function (_ref) {
        _inherits(Class, _ref);

        function Class() {
          _classCallCheck(this, Class);

          return _possibleConstructorReturn(this, Object.getPrototypeOf(Class).call(this));

          /* if ('construct' in config) {
            super();
            // config.construct.call(this, ...args);
          } else {
            super(...args);
          } */
        }

        _createClass(Class, [{
          key: 'foo',
          value: function foo() {
            return 'foo';
          }
        }, {
          key: 'getter',
          get: function get() {
            return 'get';
          }
        }]);

        return Class;
      })(this);

      Object.defineProperty(Class, 'name', {
        configurable: true,
        value: name
      });

      var mixin = function mixin(destination, source) {
        for (var prop in source) {
          if (prop === 'static') {
            mixin(destination.constructor, source.static);
          } else if (prop !== 'construct') {
            var descriptor = Object.getOwnPropertyDescriptor(source, prop);
            descriptor.enumerable = false;

            Object.defineProperty(destination, prop, descriptor);
          }
        }
      };

      mixin(Class.prototype, config);

      if (parent !== null) {
        (parent || draft.Group).mixin(_defineProperty({}, name.toLowerCase(), function () {
          var instance = this.append(new Class());
          if ('construct' in config) {
            var _config$construct;

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              args[_key4] = arguments[_key4];
            }

            (_config$construct = config.construct).call.apply(_config$construct, [instance].concat(args));
          }
          return instance;
        }));
      }

      return Class;
    }
  }, {
    key: 'mixin',
    value: function mixin(source) {
      draft.mixin(this, source);
    }
  }]);

  return Element;
})();

draft.Element.mixin(['event', 'transform']);

draft.Group = (function (_draft$Element) {
  _inherits(Group, _draft$Element);

  function Group(name) {
    _classCallCheck(this, Group);

    // Initialize children array

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this, name));

    _this4.children = [];
    return _this4;
  }

  _createClass(Group, [{
    key: 'child',
    value: function child(name) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _child = _step3.value;

          if (_child.meta.name === name) {
            return _child;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }, {
    key: 'add',
    value: function add(child) {
      // Add a reference to the child's parent and containing doc
      child.parent = this;
      child.doc = this.doc || this;

      // Add the child to its type array
      var type = child.type;
      (child.doc.elements[type] || (child.doc.elements[type] = [])).push(child);
      // Set the child's id
      child._id = child.doc.elements[type].length;
      // _id.set(child, child.doc.elements[type].length);

      child.unit(this.unit());
      if (type === 'group') {
        child.system(this.system());
      }

      // Add the child to the end of the children array
      this.children.push(child);

      // Fire the 'add' event to all listeners
      this.fire('add', child);

      return this;
    }
  }, {
    key: 'append',
    value: function append(child) {
      this.add(child);
      return child;
    }
  }, {
    key: 'remove',
    value: function remove(child) {
      // BACKLOG: return child?
      this.fire('remove', child);
      return this;
    }
  }, {
    key: 'map',
    get: function get() {
      return ['x', 'y', 'z', 'alpha'];
    }
  }, {
    key: 'firstChild',
    get: function get() {
      return this.children[0];
    }
  }, {
    key: 'lastChild',
    get: function get() {
      return this.children[this.children.length - 1];
    }
  }]);

  return Group;
})(draft.Element);

draft.Group.mixin(['system', 'translate', 'rotate']);

draft.Group.mixin({
  group: function group(name) {
    return this.append(new draft.Group(name));
  }
});

draft.Doc = (function (_draft$Group) {
  _inherits(Doc, _draft$Group);

  function Doc(name) {
    _classCallCheck(this, Doc);

    // Initialize elements container

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Doc).call(this, name));

    _this5.elements = {};

    _this5.prop({
      system: draft.defaults.system,
      unit: draft.defaults.unit
    });
    return _this5;
  }

  return Doc;
})(draft.Group);

draft.doc = function doc(name) {
  var newDoc = new draft.Doc(name);

  (draft.docs || (draft.docs = [])).push(newDoc);
  newDoc._id = draft.docs.length;

  return newDoc;
};

draft.View = (function (_draft$Element2) {
  _inherits(View, _draft$Element2);

  function View() {
    _classCallCheck(this, View);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments));
  }

  _createClass(View, [{
    key: 'map',

    /* render(renderer) {
      this['render' + renderer.toUpperCase()]();
    } */

    get: function get() {
      return ['x', 'y', 'z', 'alpha', 'width', 'height'];
    }
  }, {
    key: 'aspectRatio',
    get: function get() {
      var width = draft.types.length(this.prop('width')).value;
      var height = draft.types.length(this.prop('height')).value;

      var gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
      };

      gcd = gcd(width, height);
      return width / gcd + ':' + height / gcd;
    }
  }]);

  return View;
})(draft.Element);

draft.View.mixin(['translate', 'rotate', 'scale']);

draft.Group.mixin({
  // TODO: get group bounding box for default size

  view: function view(name) {
    return this.append(new draft.View(name)).size(100, 100);
  }
});

draft.Point = (function (_draft$Element3) {
  _inherits(Point, _draft$Element3);

  function Point() {
    _classCallCheck(this, Point);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Point).apply(this, arguments));
  }

  _createClass(Point, [{
    key: 'map',
    get: function get() {
      // TODO: remove xyz from element properties
      return ['x', 'y', 'z', 'stroke'];
    }
  }]);

  return Point;
})(draft.Element);

draft.Point.mixin(['translate', 'stroke']);

draft.Group.mixin({
  point: function point(name) {
    return this.append(new draft.Point(name));
  }
});

draft.Line = (function (_draft$Point) {
  _inherits(Line, _draft$Point);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Line).apply(this, arguments));
  }

  _createClass(Line, [{
    key: 'map',
    get: function get() {
      var _get2;

      // TODO: remove angles from element properties
      return (_get2 = _get(Object.getPrototypeOf(Line.prototype), 'map', this)).concat.apply(_get2, ['alpha', 'width']);
    }
  }]);

  return Line;
})(draft.Point);

// TODO: skew transformation?
draft.Line.mixin(['rotate', 'scale']);

draft.Group.mixin({
  line: function line(name) {
    return this.append(new draft.Line(name)).size(100);
  }
});

draft.Shape = draft.Line.extend('Shape', {
  get map() {
    return ['x', 'y', 'z', 'alpha', 'width', 'height', 'skewX', 'skewY', 'fill', 'stroke'];
  }
});

draft.Shape.mixin(['skew', 'fill']);

draft.Rectangle = draft.Shape.extend('Rectangle', {
  construct: function construct(width, height) {
    this.size(width || 75, height || 100);
  },

  // Hehehe
  get rekt() {
    return Math.floor(Math.random() * 101) + '% rekt';
  }
});

draft.Group.mixin({
  // TODO: rename to rectangle(name)

  rect: function rect() {
    return this.rectangle.apply(this, arguments);
  }
});

draft.Square = draft.Rectangle.extend('Square', {
  construct: function construct(width) {
    this.size(width || 100);
  },

  get map() {
    return ['x', 'y', 'z', 'alpha', 'width', 'skewX', 'skewY', 'fill', 'stroke'];
  }
});

draft.Ellipse = draft.Shape.extend('Ellipse', {
  construct: function construct(width, height) {
    this.size(width || 75, height || 100);
  }
});

draft.Circle = draft.Ellipse.extend('Circle', {
  construct: function construct(width) {
    this.size(width || 100);
  },

  get map() {
    return ['x', 'y', 'z', 'alpha', 'width', 'skewX', 'skewY', 'fill', 'stroke'];
  },
  /* get propMap() {
    return {
      diameter: ['width', 'height']
    };
  }, */
  radius: function radius(r) {
    return this.size(r * 2, r * 2);
  }
});
return draft;
}));
