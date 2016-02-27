/*
* draft-svg - A plugin for draft.js that renders models using SVG
* version v0.2.0
* http://draft.js.org
*
* copyright Jordi Pakey-Rodriguez <me@jordi.codes>
* license MIT
*
* BUILT: Sat Feb 27 2016 02:25:10 GMT-0600 (CST)
*/
'use strict';

(function () {
  // TODO: use draft.WeakMap
  var _svg = new WeakMap();
  var _maxWidth = new WeakMap();
  var _maxHeight = new WeakMap();

  draft.View.mixin({
    svg: function svg(width, height) {
      var _this = this;

      width = width ? draft.types.length(width) : _maxWidth.get(this);
      height = height ? draft.types.length(height) : _maxHeight.get(this);

      var calcX = function calcX(element) {
        return (element.prop('x') || 0) - element.prop('width') / 2;
      };
      var calcY = function calcY(element) {
        return -(element.prop('y') || 0) - element.prop('height') / 2;
      };

      var domPrefix = this.doc.domID + ':' + this.domID + ':svg';
      var domID = function domID(element) {
        return domPrefix + ':' + element.domID;
      };

      _maxWidth.set(this, width || this.prop('width'));
      _maxHeight.set(this, height || this.prop('height'));

      if (!_svg.has(this)) {
        var _render;

        var svg;
        var listener;

        (function () {
          var NS = 'http://www.w3.org/2000/svg';
          // const XMLNS = 'http://www.w3.org/2000/xmlns/';
          // const XLINK = 'http://www.w3.org/1999/xlink';
          var VERSION = '1.1';

          _render = function render(element) {
            // console.info('rendering svg:', element.domID);

            // TODO: separate listener for each property?
            var node, _listener2;
            var type = element.type;
            var create = function create(svgType) {
              return document.createElementNS(NS, svgType);
            };

            if (element instanceof draft.Group) {
              node = create('g');

              var renderChild = function renderChild(child) {
                var childNode = _render(child);
                if (childNode) {
                  node.appendChild(childNode);
                }
              };

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = element.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var child = _step.value;

                  renderChild(child);
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

              element.on('add', renderChild);

              element.on('remove', function (child) {
                node.removeChild(document.getElementByID(domID(child)));
              });

              type = 'group';
            }

            switch (type) {
              case 'line':
                node = create('line');

                _listener2 = function listener(prop, val) {
                  var size;

                  switch (prop) {
                    case 'y':
                      val *= -1;
                      size = 0;
                      break;
                    case 'width':
                      val = this.target.prop('x');
                    // Falls through
                    case 'x':
                      prop = 'x';
                      size = this.target.prop('width') / 2;
                      break;
                    default:
                      return;
                  }

                  node.setAttribute(prop + '1', val - size);
                  node.setAttribute(prop + '2', val + size);
                };

                break;
              case 'group':
              case 'rectangle':
                node = node || create('rect');

                _listener2 = function listener(prop, val) {
                  var link;

                  switch (prop) {
                    case 'width':
                      link = 'x';
                    // Falls through
                    case 'height':
                      link = link || 'y';
                      _listener2.call(this, link, this.target.prop(link));
                      break;
                    case 'y':
                      link = 'height';
                      val *= -1;
                    // Falls through
                    case 'x':
                      link = link || 'width';
                      val -= this.target.prop(link) / 2;
                      break;
                    default:
                      return;
                  }

                  node.setAttribute(prop, val);
                };

                break;
              case 'square':
                node = node || create('rect');

                _listener2 = function _listener(prop, val) {
                  switch (prop) {
                    case 'width':
                      node.setAttribute('height', val);

                      var _arr = ['x', 'y'];
                      for (var _i = 0; _i < _arr.length; _i++) {
                        var link = _arr[_i];
                        _listener2.call(this, link, this.target.prop(link));
                      }

                      break;
                    case 'y':
                      val *= -1;
                    // Falls through
                    case 'x':
                      val -= this.target.prop('width') / 2;
                      break;
                    default:
                      return;
                  }

                  node.setAttribute(prop, val);
                };

                break;
              case 'ellipse':
                node = create('ellipse');

                _listener2 = function _listener2(prop, val) {
                  switch (prop) {
                    case 'width':
                      prop = 'rx';
                      val.value /= 2;
                      break;
                    case 'height':
                      prop = 'ry';
                      val.value /= 2;
                      break;
                    case 'y':
                      val.value *= -1;
                    // Falls through
                    case 'x':
                      prop = 'c' + prop;
                      break;
                    default:
                      return;
                  }

                  node.setAttribute(prop, val);
                };

                break;
              case 'circle':
                node = create('circle');

                _listener2 = function _listener2(prop, val) {
                  switch (prop) {
                    case 'diameter':
                    case 'width':
                      prop = 'r';
                      val.value /= 2;
                      break;
                    case 'y':
                      val.value *= -1;
                    // Falls through
                    case 'x':
                      prop = 'c' + prop;
                      break;
                    default:
                      return;
                  }

                  node.setAttribute(prop, val);
                };

                break;
              default:
                return;
            }

            // TODO: support all elements
            node.id = domID(element);

            var hasStyle = [];
            var _arr2 = ['fill', 'stroke'];
            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
              var style = _arr2[_i2];
              if (style in element) {
                hasStyle.push(style);
              }
            }

            if (hasStyle.length) {
              var styleListener = function styleListener(prop, val) {
                prop = prop.replace('.color', '').replace('.', '-');

                var color = /^(fill|stroke)(-opacity)?$/;
                var stroke = /^stroke-(width)?$/;

                if (color.test(prop) || stroke.test(prop)) {
                  node.setAttribute(prop, val);
                }
              };

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = hasStyle[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var style = _step2.value;
                  var _arr3 = ['color', 'opacity', 'width'];

                  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
                    var prop = _arr3[_i3];
                    prop = style + '.' + prop;
                    var val = element.prop(prop) || draft.defaults[prop];

                    styleListener(prop, val);
                  }
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

              element.on('change', styleListener);
            }

            for (var prop in element.prop()) {
              _listener2.apply({ target: element }, [prop, element.prop(prop)]);
            }

            element.on('change', _listener2);

            node.addEventListener('click', function () {
              element.fire('click');
            });

            return node;
          };

          svg = document.createElementNS(NS, 'svg');

          _svg.set(_this, svg);
          svg.setAttribute('xmlns', NS);
          svg.setAttribute('version', VERSION);
          // svg.setAttributeNS(XMLNS, 'xmlns:xlink', XLINK);

          svg.id = domID(_this);

          listener = function listener(prop) {
            if (prop === 'width' || prop === 'height') {
              var targetWidth = this.target.prop('width');
              var targetHeight = this.target.prop('height');

              // 1 SVG user unit = 1px
              svg.setAttribute('viewBox', [calcX(this.target), calcY(this.target), targetWidth, targetHeight].map(function (val) {
                return val.valueOf();
              }).join(' '));

              var zoom = Math.min(_maxWidth.get(this.target) / targetWidth, _maxHeight.get(this.target) / targetHeight);

              var svgWidth = targetWidth * zoom;
              var svgHeight = targetHeight * zoom;

              _svg.get(this.target).setAttribute('width', svgWidth);
              _svg.get(this.target).setAttribute('height', svgHeight);

              // console.info('aspect ratio:', this.target.aspectRatio);
            }
          };

          listener.apply({ target: _this }, ['width']);
          listener.apply({ target: _this }, ['height']);

          _this.on('change', listener);

          svg.appendChild(_render(_this.parent));
        })();
      }

      return _svg.get(this);
    }
  });
})();