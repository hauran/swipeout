'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactHammerjs = require('react-hammerjs');

var _reactHammerjs2 = _interopRequireDefault(_reactHammerjs);

var _object = require('object.omit');

var _object2 = _interopRequireDefault(_object);

var _splitObject3 = require('./util/splitObject');

var _splitObject4 = _interopRequireDefault(_splitObject3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Swipeout = function (_React$Component) {
  (0, _inherits3["default"])(Swipeout, _React$Component);

  function Swipeout(props) {
    (0, _classCallCheck3["default"])(this, Swipeout);

    var _this = (0, _possibleConstructorReturn3["default"])(this, _React$Component.call(this, props));

    _this.onPanStart = _this.onPanStart.bind(_this);
    _this.onPan = _this.onPan.bind(_this);
    _this.onPanEnd = _this.onPanEnd.bind(_this);

    _this.openedLeft = false;
    _this.openedRight = false;
    return _this;
  }

  Swipeout.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props;
    var left = _props.left;
    var right = _props.right;

    var width = this.refs.content.offsetWidth;

    if (this.refs.cover) {
      this.refs.cover.style.width = width + 'px';
    }

    this.contentWidth = width;
    this.btnsLeftWidth = width / 5 * left.length;
    this.btnsRightWidth = width / 5 * right.length;

    document.body.addEventListener('touchstart', this.onCloseSwipe.bind(this), true);
  };

  Swipeout.prototype.componentWillUnmount = function componentWillUnmount() {
    document.body.removeEventListener('touchstart', this.onCloseSwipe.bind(this));
  };

  Swipeout.prototype.onCloseSwipe = function onCloseSwipe(ev) {
    if (this.openedLeft || this.openedRight) {
      var pNode = function (node) {
        while (node.parentNode && node.parentNode !== document.body) {
          if (node.className.indexOf('rc-swipeout-actions') > -1) {
            return node;
          }
          node = node.parentNode;
        }
      }(ev.target);
      if (!pNode) {
        ev.preventDefault();
        this.close();
      }
    }
  };

  Swipeout.prototype.onPanStart = function onPanStart(e) {
    if (this.props.disabled) {
      return;
    }
    this.panStartX = e.deltaX;
  };

  Swipeout.prototype.onPan = function onPan(e) {
    if (this.props.disabled) {
      return;
    }
    var _props2 = this.props;
    var left = _props2.left;
    var right = _props2.right;

    var posX = e.deltaX - this.panStartX;
    if (posX < 0 && right.length) {
      this._setStyle(Math.min(posX, 0));
    } else if (posX > 0 && left.length) {
      this._setStyle(Math.max(posX, 0));
    }
  };

  Swipeout.prototype.onPanEnd = function onPanEnd(e) {
    if (this.props.disabled) {
      return;
    }

    var _props3 = this.props;
    var left = _props3.left;
    var right = _props3.right;

    var posX = e.deltaX - this.panStartX;
    var contentWidth = this.contentWidth;
    var btnsLeftWidth = this.btnsLeftWidth;
    var btnsRightWidth = this.btnsRightWidth;
    var openX = contentWidth * 0.33;
    var openLeft = posX > openX || posX > btnsLeftWidth / 2;
    var openRight = posX < -openX || posX < -btnsRightWidth / 2;

    if (openRight && posX < 0 && right.length) {
      this.open(-btnsRightWidth, false, true);
    } else if (openLeft && posX > 0 && left.length) {
      this.open(btnsLeftWidth, true, false);
    } else {
      this.close();
    }
  };

  // left & right button click


  Swipeout.prototype.onBtnClick = function onBtnClick(ev, btn) {
    var onPress = btn.onPress;
    if (onPress) {
      onPress(ev);
    }
    if (this.props.autoClose) {
      this.close();
    }
  };

  Swipeout.prototype._getContentEasing = function _getContentEasing(value, limit) {
    // limit content style left when value > actions width
    if (value < 0 && value < limit) {
      return limit - Math.pow(limit - value, 0.85);
    } else if (value > 0 && value > limit) {
      return limit + Math.pow(value - limit, 0.85);
    }
    return value;
  };

  // set content & actions style


  Swipeout.prototype._setStyle = function _setStyle(value) {
    if(!this.refs.content || !this.refs.cover) return
    var _props4 = this.props;
    var left = _props4.left;
    var right = _props4.right;

    var limit = value > 0 ? this.btnsLeftWidth : -this.btnsRightWidth;
    var contentLeft = this._getContentEasing(value, limit);
    this.refs.content.style.left = contentLeft + 'px';
    this.refs.cover.style.display = Math.abs(value) > 0 ? 'block' : 'none';
    this.refs.cover.style.left = contentLeft + 'px';
    if (left.length) {
      var leftWidth = Math.max(Math.min(value, Math.abs(limit)), 0);
      this.refs.left.style.width = leftWidth + 'px';
    }
    if (right.length) {
      var rightWidth = Math.max(Math.min(-value, Math.abs(limit)), 0);
      this.refs.right.style.width = rightWidth + 'px';
    }
  };

  Swipeout.prototype.open = function open(value, openedLeft, openedRight) {
    if (!this.openedLeft && !this.openedRight) {
      this.props.onOpen();
    }

    this.openedLeft = openedLeft;
    this.openedRight = openedRight;
    this._setStyle(value);
  };

  Swipeout.prototype.close = function close() {
    if (this.openedLeft || this.openedRight) {
      this.props.onClose();
    }
    this._setStyle(0);
    this.openedLeft = false;
    this.openedRight = false;
  };

  Swipeout.prototype.renderButtons = function renderButtons(buttons, ref) {
    var _this2 = this;

    var prefixCls = this.props.prefixCls;

    return buttons && buttons.length ? _react2["default"].createElement(
      'div',
      { className: prefixCls + '-actions ' + prefixCls + '-actions-' + ref, ref: ref },
      buttons.map(function (btn, i) {
        return _react2["default"].createElement(
          'div',
          { key: i,
            className: prefixCls + '-btn',
            style: btn.style,
            onClick: function onClick(e) {
              return _this2.onBtnClick(e, btn);
            }
          },
          _react2["default"].createElement(
            'div',
            { className: prefixCls + '-text' },
            btn.text || 'Click'
          )
        );
      })
    ) : null;
  };

  Swipeout.prototype.render = function render() {
    var _splitObject = (0, _splitObject4["default"])(this.props, ['prefixCls', 'left', 'right', 'children']);

    var _splitObject2 = (0, _slicedToArray3["default"])(_splitObject, 2);

    var _splitObject2$ = _splitObject2[0];
    var prefixCls = _splitObject2$.prefixCls;
    var left = _splitObject2$.left;
    var right = _splitObject2$.right;
    var children = _splitObject2$.children;
    var restProps = _splitObject2[1];

    var divProps = (0, _object2["default"])(restProps, ['disabled', 'autoClose', 'onOpen', 'onClose']);

    return left.length || right.length ? _react2["default"].createElement(
      'div',
      (0, _extends3["default"])({ className: '' + prefixCls }, divProps),
      _react2["default"].createElement(
        _reactHammerjs2["default"],
        {
          direction: 'DIRECTION_HORIZONTAL',
          onPanStart: this.onPanStart,
          onPan: this.onPan,
          onPanEnd: this.onPanEnd
        },
        _react2["default"].createElement(
          'div',
          { className: prefixCls + '-content', ref: 'content' },
          children
        )
      ),
      _react2["default"].createElement('div', { className: prefixCls + '-cover', ref: 'cover' }),
      this.renderButtons(left, 'left'),
      this.renderButtons(right, 'right')
    ) : _react2["default"].createElement(
      'div',
      (0, _extends3["default"])({ ref: 'content' }, divProps),
      children
    );
  };

  return Swipeout;
}(_react2["default"].Component);

Swipeout.propTypes = {
  prefixCls: _react.PropTypes.string,
  autoClose: _react.PropTypes.bool,
  disabled: _react.PropTypes.bool,
  left: _react.PropTypes.arrayOf(_react.PropTypes.object),
  right: _react.PropTypes.arrayOf(_react.PropTypes.object),
  onOpen: _react.PropTypes.func,
  onClose: _react.PropTypes.func,
  children: _react.PropTypes.any
};
Swipeout.defaultProps = {
  prefixCls: 'rc-swipeout',
  autoClose: false,
  disabled: false,
  left: [],
  right: [],
  onOpen: function onOpen() {},
  onClose: function onClose() {}
};
exports["default"] = Swipeout;
module.exports = exports['default'];
