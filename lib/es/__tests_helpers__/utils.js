import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import "@testing-library/jest-dom/extend-expect";
import { screen, waitFor } from "@testing-library/react";
import { getRouter } from "../../src/NavigoReact";
export function navigate(_x) {
  return _navigate.apply(this, arguments);
}

function _navigate() {
  _navigate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(path) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return waitFor(function () {
              getRouter().navigate(path);
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

export function delay(_x2) {
  return _delay.apply(this, arguments);
}

function _delay() {
  _delay = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(ms) {
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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

export function expectContent(html) {
  expect(screen.getByTestId("container").textContent).toEqual(html);
}