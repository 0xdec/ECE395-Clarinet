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
  var mixin = {
    [name]: Object.defineProperty(function(...args) {
      return this.transform(name, ...args);
    }, 'name', {
      configurable: true,
      value: name
    })
  };

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
    for (let val of source) {
      draft.mixin(destination, val);
    }
  } else if (typeof source == 'string') {
    draft.mixin(destination, draft.mixins[source]);
  } else if (typeof source == 'object') {
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        destination.prototype[key] = source[key];
      }
    }
  }
};

draft.proxy = function proxy(obj, setInit = true) {
  var access = function(target, prop, init) {
    if (typeof prop == 'string') {
      return access(target, prop.split('.'), init);
    }

    let p = prop.shift();

    if (prop.length && typeof target == 'object' && (init || p in target)) {
      // TODO: when init is false, setting obj['foo.bar'] will incorrectly set
      // obj['foo'] instead
      return access(p in target ? target[p] : (target[p] = {}), prop, init);
    }

    return [target, p];
  };

  // TODO: return null if the property does not exist or was not set/deleted?
  var handler = {
    has(target, prop) {
      var [t, p] = access(target, prop);
      return !!t[p];
    },
    get(target, prop) {
      var [t, p] = access(target, prop);
      return t[p];
    },
    set(target, prop, val) {
      var [t, p] = access(target, prop, setInit);
      t[p] = val;
      return true;
    },
    deleteProperty(target, prop) {
      var [t, p] = access(target, prop);
      return delete t[p];
    }
  };

  // BACKLOG: wait for browser support for ES6 proxies
  return new Proxy(obj, handler);
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

draft.types.Float = class Float {
  constructor(value) {
    this.value = parseFloat(value);
  }

  get type() {
    return 'float';
  }

  get regex() {
    // Matches all floating point values. Should match:
    // 123
    // -123.45
    // 123e5
    // 123.45E+5
    return '[-+]?[0-9]*\\.?[0-9]+(?:[eE][-+]?[0-9]+)?';
  }

  valueOf() {
    return this.value;
  }
};

draft.types.float = function float(value) {
  return value == undefined ? value : new draft.types.Float(value);
};

draft.defaults.unit = 'px';

// TODO: make type, regex, units, and test static
draft.types.Length = class Length extends draft.types.Float {
  constructor(value, unit) {
    super(value);

    value = this.test(value);
    unit = this.test(unit);

    if (!isNaN(this.value) && (value || unit)) {
      this.unit = value || unit;
      this.convert(unit);
    } else {
      this.unit = draft.defaults.unit;
    }
  }

  get type() {
    return 'length';
  }

  get regex() {
    return '(px|pt|pc|in|ft|yd|mi|mm|cm|dm|km|m)';
  }

  get units() {
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

  test(val) {
    // TODO: strict match anchor (^ instead of word end)
    val = new RegExp(`${this.regex}$`, 'i').exec(val);
    return val ? val[0].toLowerCase() : false;
  }

  convert(newUnit) {
    newUnit = this.test(newUnit);

    if (!newUnit) {
      return false;
    }

    var chain = (unit, reverse) => {
      let units = this.units[unit];

      this.value *= reverse ? units[1] : units[0];
      this.value /= reverse ? units[0] : units[1];

      return units[2];
    };

    let unit = this.unit;
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

  valueOf() {
    // TODO: use px instead of draft.defaults.unit?
    return new Length(this.toString(), draft.defaults.unit).value;
  }

  toString() {
    return this.value + this.unit;
  }
};

draft.types.length = function length(value, unit) {
  return value == undefined ? value : new draft.types.Length(value, unit);
};

draft.types.Color = class Color {
  constructor(color) {
    color = new RegExp(`^(?:${this.regex})$`, 'i').exec(
      isNaN(color) ? color : color.toString(16));

    if (color !== null) {
      this.color = color[0].toLowerCase();

      for (let i = 1; i <= 3; i++) {
        color[i] = parseInt(color[i] ||
          parseInt(color[i + 3] || color[i + 6].repeat(2), 16), 10);
      }

      this.red = color[1];
      this.green = color[2];
      this.blue = color[3];
    }
  }

  get type() {
    return 'color';
  }

  get regex() {
    var rgbColor = '([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])';
    var rgb = `rgb\\(${rgbColor}, ?${rgbColor}, ?${rgbColor}\\)`;

    var hexColor = '([0-9a-f]{2})'.repeat(3);
    var hex = `#?(?:${hexColor}|${hexColor.replace(/\{2\}/g, '')})`;
    // var hex = '#?(?:[0-9a-f]{3}){1,2}';

    return `${rgb}|${hex}`;
  }

  valueOf() {
    return (this.red << 16) | (this.green << 8) | this.blue;
  }

  toString() {
    return this.color;
  }
};

draft.types.color = function color(value) {
  return value == undefined ? value : new draft.types.Color(value);
};

// These methods are adapted from Oliver Caldwell's EventEmitter library, which
// he has released under the Unlicense (public domain).
// GitHub Repository: https://github.com/Olical/EventEmitter

draft.mixins.event = {
  on(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];

      if (!listeners.map(l => l.listener).includes(listener)) {
        listeners.push(typeof listener == 'object' ? listener : {
          listener: listener,
          once: false
        });
      }
    }

    return this;
  },

  once(evt, listener) {
    return this.on(evt, {
      listener: listener,
      once: true
    });
  },

  off(evt, listener) {
    var listenersMap = this.getListeners(evt, true);

    for (var key in listenersMap) {
      var listeners = listenersMap[key];
      var index = listeners.map(l => l.listener).lastIndexOf(listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }

    return this;
  },

  // TODO: use rest for args (...args)
  fire(evt, args) {
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

  defineEvent(...evts) {
    for (var evt of evts) {
      this.getListeners(evt);
    }

    return this;
  },

  removeEvent(evt) {
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

  getListeners(evt, map) {
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
  _getEvents() {
    return this._events || (this._events = {});
  }
};

draft.mixins.transform = {
  transform(transform, ...args) {
    var obj = {
      transform,
      args: {}
    };
    transform = draft.transforms[transform];

    for (let arg in args) {
      let prop = transform.args[arg];
      obj.args[prop] = args[arg];

      if (this.map.includes(prop)) {
        let val = transform.transform.call(this, prop, args[arg]);
        this.prop(prop, val);
      }
    }

    this.transforms.push(obj);
    this.fire(`transform:${obj.transform}`, obj);

    return this;
  }
};

draft.transforms.translate = {
  args: ['x', 'y', 'z'],
  transform(prop, val) {
    val = draft.types.length(val || 0);
    return draft.types.length((this.prop(prop) || 0) + val, this.unit());
  }
};

draft.transforms.position = {
  args: draft.transforms.translate.args,
  transform(prop, val) {
    return draft.types.length(val || 0, this.unit());
  }
};

draft.mixins.translate = {
  translate: draft.createTransform('translate'),
  position: draft.createTransform('position')
};

draft.transforms.rotate = {
  args: ['alpha', 'beta', 'gamma', 'order'],
  transform(prop, val) {
    val = draft.types.angle(val || 0);
    return draft.types.angle((this.prop(prop) || 0) + val, this.defaults.angle);
  }
};

draft.transforms.orientation = {
  args: draft.transforms.rotate.args,
  transform(prop, currVal, val) {
    return draft.types.angle(val || 0, this.defaults.angle);
  }
};

draft.mixins.rotate = {
  rotate: draft.createTransform('rotate'),
  orientation: draft.createTransform('orientation')
};

draft.transforms.scale = {
  args: ['width', 'height', 'length'],
  transform(prop, val) {
    val = parseFloat(val) || 1;
    return draft.types.length((this.prop(prop) || 0) * val, this.unit());
  }
};

draft.transforms.size = {
  args: draft.transforms.scale.args,
  transform(prop, val) {
    return draft.types.length(val || 0, this.unit());
  }
};

draft.mixins.scale = {
  scale: draft.createTransform('scale'),
  size: draft.createTransform('size')
};

draft.transforms.skew = {
  args: ['skewX', 'skewY', 'skewZ'],
  transform(prop, val) {
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
  system(system) {
    /* if (this.prop('system') != system) {
      // BACKLOG:20 recursively convert all elements to new system?
    } */
    return this.prop('system', system);
  }
};

draft.defaults.system = 'cartesian';

draft.mixins.fill = {
  // TODO: combine color and opacity into fill()
  fill(color) {
    return this.fillColor(color);
  },

  fillColor(color) {
    return this.prop('fill.color', draft.types.color(color));
  },

  fillOpacity(opacity) {
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
  stroke(color) {
    return this.strokeColor(color);
  },

  strokeColor(color) {
    return this.prop('stroke.color', draft.types.color(color));
  },

  strokeOpacity(opacity) {
    // TODO: move into generic function?
    if (/^(0(\.\d*)?|1(\.0*)?)$/.test(opacity)) {
      opacity = parseFloat(opacity, 10);
    }

    return this.prop('stroke.opacity', opacity);
  },

  strokeWidth(width) {
    return this.prop('stroke.width', draft.types.length(width));
  }
};

draft.defaults['stroke.color'] = '#000';
draft.defaults['stroke.opacity'] = 1;
draft.defaults['stroke.width'] = 1;

// let _type = new WeakMap();
// let _id = new WeakMap();

draft.Element = class Element {
  constructor(name) {
    // Make sure _metadata and _properties are initialized
    this._metadata = {
      name: name
    };
    this._properties = {};
    this.transforms = [];

    // HACK:0 use this.constructor.name to get an element's type. Requires all
    // subclasses to have a defined constructor.
    for (let type in draft) {
      if (this.constructor === draft[type]) {
        this._type = type.toLowerCase();
        // _type.set(this, type.toLowerCase());
        break;
      }
    }
    if (!this._type) {
      this._type = this.constructor.name;
    }
    console.log('NAME:', this.constructor.name);
  }

  /* static inherit(source, addSuper) {
    draft.inherit(this, source, addSuper);
  } */

  static extend(name, config, parent) {
    var Class = class extends this {
      constructor() {
        super();

        /* if ('construct' in config) {
          super();
          // config.construct.call(this, ...args);
        } else {
          super(...args);
        } */
      }
      foo() {
        return 'foo';
      }
      get getter() {
        return 'get';
      }
    };

    Object.defineProperty(Class, 'name', {
      configurable: true,
      value: name
    });

    var mixin = (destination, source) => {
      for (let prop in source) {
        if (prop === 'static') {
          mixin(destination.constructor, source.static);
        } else if (prop !== 'construct') {
          let descriptor = Object.getOwnPropertyDescriptor(source, prop);
          descriptor.enumerable = false;

          console.info(prop, descriptor);

          Object.defineProperty(destination, prop, descriptor);
        }
      }
    };

    mixin(Class.prototype, config);

    console.log(`${name}:`, Class);

    if (parent !== null) {
      (parent || draft.Group).mixin({
        [name.toLowerCase()](...args) {
          var instance = this.append(new Class());
          if ('construct' in config) {
            config.construct.call(instance, ...args);
          }
          return instance;
        }
      });
    }

    return Class;
  }

  static mixin(source) {
    draft.mixin(this, source);
  }

  get type() {
    return this._type;
    // return _type.get(this);
  }

  get id() {
    return this._id;
    // return _id.get(this);
  }

  // Construct a unique ID from the element's type and ID
  get domID() {
    var id = String(this.id);

    // TODO: make the domID digit length configurable
    return `${this.type}_${'0'.repeat(Math.max(4 - id.length, 0))}${id}`;
  }

  get meta() {
    return this._metadata;
  }

  prop(prop, val) {
    if (prop === undefined) {
      // Act as a full properties getter if prop is undefined
      return this._properties;
    } else if (prop === null) {
      // Delete all properties if prop is null
      this._properties = {};
    } else if (typeof prop == 'string') {
      var props = draft.proxy(this._properties);

      if (val === undefined) {
        // Act as an individual property getter if val is undefined
        // TODO: do a fuzzy-find? For example, el.prop('width') would match
        // el._properties.size.width if el._properties.width is undefined
        return prop in props ? props[prop] : null;
      } else if (val === null) {
        // Delete the property if val is null
        delete props[prop];
        this.fire('change', [prop, val]);
      } else if (props[prop] !== val) {
        // Act as an individual property setter if both prop and val are defined

        // TODO: let properties be objects (don't stringify)
        if (val.type === 'color') {
          val = String(val);
        }

        props[prop] = val;
        this.fire('change', [prop, val]);
      }
    } else if (typeof prop == 'object') {
      // Act as a getter if prop is an object with only null values.
      // Act as a setter if prop is an object with at least one non-null value.
      let setter = false;

      for (let p in prop) {
        // Get this._properties[p] and save it to prop[p]
        prop[p] = this.prop(p, prop[p]);
        // If the returned value is an object, prop[p] is non-null, so act like
        // a setter.
        setter = setter || typeof prop[p] == 'object';
      }

      return setter ? this : prop;
    }

    // Chainable if 'this' is returned
    return this;
  }

  // Get/set the element's default length unit
  unit(unit) {
    return this.prop('unit', unit);
  }

  // TODO: use rest (...blacklist) for multiple blacklist items?
  stringify(blacklist) {
    var replacer;

    if (Array.isArray(blacklist)) {
      replacer = function(key, val) {
        if (blacklist.includes(key)) {
          return undefined;
        }

        return val;
      };
    } else if (blacklist instanceof RegExp) {
      replacer = function(key, val) {
        if (blacklist.test(key)) {
          return undefined;
        }

        return val;
      };
    }

    return JSON.stringify(this, replacer, 2);
  }

  toJSON() {
    return {
      type: this.type,
      id: this.id,
      properties: this.prop(),
      children: this.children
    };
  }
};

draft.Element.mixin([
  'event',
  'transform'
]);

draft.Group = class Group extends draft.Element {
  constructor(name) {
    super(name);

    // Initialize children array
    this.children = [];
  }

  get map() {
    return ['x', 'y', 'z', 'alpha'];
  }

  get firstChild() {
    return this.children[0];
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  child(name) {
    for (let child of this.children) {
      if (child.meta.name === name) {
        return child;
      }
    }
  }

  add(child) {
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

  append(child) {
    this.add(child);
    return child;
  }

  remove(child) {
    // BACKLOG: return child?
    this.fire('remove', child);
    return this;
  }
};

draft.Group.mixin([
  'system',
  'translate',
  'rotate'
]);

draft.Group.mixin({
  group(name) {
    return this.append(new draft.Group(name));
  }
});

draft.Doc = class Doc extends draft.Group {
  constructor(name) {
    super(name);

    // Initialize elements container
    this.elements = {};

    this.prop({
      system: draft.defaults.system,
      unit: draft.defaults.unit
    });
  }
};

draft.doc = function doc(name) {
  var newDoc = new draft.Doc(name);

  (draft.docs || (draft.docs = [])).push(newDoc);
  newDoc._id = draft.docs.length;

  return newDoc;
};

draft.View = class View extends draft.Element {
  /* render(renderer) {
    this['render' + renderer.toUpperCase()]();
  } */

  get map() {
    return ['x', 'y', 'z', 'alpha', 'width', 'height'];
  }

  get aspectRatio() {
    var width = draft.types.length(this.prop('width')).value;
    var height = draft.types.length(this.prop('height')).value;

    var gcd = function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    };

    gcd = gcd(width, height);
    return `${width / gcd}:${height / gcd}`;
  }
};

draft.View.mixin([
  'translate',
  'rotate',
  'scale'
]);

draft.Group.mixin({
  // TODO: get group bounding box for default size
  view(name) {
    return this.append(new draft.View(name)).size(100, 100);
  }
});

draft.Point = class Point extends draft.Element {
  get map() {
    // TODO: remove xyz from element properties
    return ['x', 'y', 'z', 'stroke'];
  }
};

draft.Point.mixin([
  'translate',
  'stroke'
]);

draft.Group.mixin({
  point(name) {
    return this.append(new draft.Point(name));
  }
});

draft.Line = class Line extends draft.Point {
  get map() {
    // TODO: remove angles from element properties
    return super.map.concat(...['alpha', 'width']);
  }
};

// TODO: skew transformation?
draft.Line.mixin([
  'rotate',
  'scale'
]);

draft.Group.mixin({
  line(name) {
    return this.append(new draft.Line(name)).size(100);
  }
});

draft.Shape = draft.Line.extend('Shape', {
  get map() {
    return [
      'x', 'y', 'z',
      'alpha',
      'width', 'height',
      'skewX', 'skewY',
      'fill', 'stroke'
    ];
  }
});

draft.Shape.mixin([
  'skew',
  'fill'
]);

draft.Rectangle = draft.Shape.extend('Rectangle', {
  construct(width, height) {
    this.size(width || 75, height || 100);
  },
  // Hehehe
  get rekt() {
    return `${Math.floor(Math.random() * 101)}% rekt`;
  }
});

draft.Group.mixin({
  // TODO: rename to rectangle(name)
  rect(...args) {
    return this.rectangle(...args);
  }
});

draft.Square = draft.Rectangle.extend('Square', {
  construct(width) {
    this.size(width || 100);
  },
  get map() {
    return [
      'x', 'y', 'z',
      'alpha',
      'width',
      'skewX', 'skewY',
      'fill', 'stroke'
    ];
  }
});

draft.Ellipse = draft.Shape.extend('Ellipse', {
  construct(width, height) {
    this.size(width || 75, height || 100);
  }
});

draft.Circle = draft.Ellipse.extend('Circle', {
  construct(width) {
    this.size(width || 100);
  },
  get map() {
    return [
      'x', 'y', 'z',
      'alpha',
      'width',
      'skewX', 'skewY',
      'fill', 'stroke'
    ];
  },
  /* get propMap() {
    return {
      diameter: ['width', 'height']
    };
  }, */
  radius(r) {
    return this.size(r * 2, r * 2);
  }
});

return draft;
}));
