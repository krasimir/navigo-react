"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.navigate = navigate;
exports.delay = delay;
exports.expectContent = expectContent;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("@testing-library/jest-dom/extend-expect");

var _react = require("@testing-library/react");

var _NavigoReact = require("../../src/NavigoReact");

function navigate(_x) {
  return _navigate.apply(this, arguments);
}

function _navigate() {
  _navigate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(path) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _react.waitFor)(function () {
              (0, _NavigoReact.getRouter)().navigate(path);
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _navigate.apply(this, arguments);
}

function delay(_x2) {
  return _delay.apply(this, arguments);
}

function _delay() {
  _delay = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ms) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (done) {
              return setTimeout(done, ms || 0);
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _delay.apply(this, arguments);
}

function expectContent(html) {
  expect(_react.screen.getByTestId("container").textContent).toEqual(html);
}