import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/react";
import { reset, Route, Switch, configureRouter } from "../NavigoReact";
import { expectContent, navigate } from "../__tests_helpers__/utils";
var warn;
describe("Given navigo-react", function () {
  beforeEach(function () {
    reset();
    warn = jest.spyOn(console, "warn").mockImplementation(function () {});
    history.pushState({}, "", "/");
  });
  afterEach(function () {
    if (warn) {
      warn.mockReset();
    }
  });
  describe("when using the Switch component", function () {
    it("should resolve only one of the routes in the list", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
                path: "/foo"
              }, "A"), /*#__PURE__*/React.createElement(Route, {
                path: "/bar"
              }, "B"), /*#__PURE__*/React.createElement(Route, {
                path: "/"
              }, "C"), /*#__PURE__*/React.createElement(Route, {
                path: "*"
              }, "D")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Route, {
                path: "/bar"
              }, "E"))));
              expectContent("C");
              _context.next = 4;
              return waitFor(function () {
                navigate("bar");
              });

            case 4:
              expectContent("BE");
              _context.next = 7;
              return waitFor(function () {
                navigate("nope");
              });

            case 7:
              expectContent("D");
              _context.next = 10;
              return waitFor(function () {
                navigate("foo");
              });

            case 10:
              expectContent("A");

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    describe("and when we have a router root set", function () {
      it("should resolve only one of the routes in the list #2", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                history.pushState({}, "", "/app");
                configureRouter("/app");
                render( /*#__PURE__*/React.createElement("div", {
                  "data-testid": "container"
                }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
                  path: "/foo"
                }, "A"), /*#__PURE__*/React.createElement(Route, {
                  path: "/bar"
                }, "B"), /*#__PURE__*/React.createElement(Route, {
                  path: "*"
                }, "C")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Route, {
                  path: "/bar"
                }, "E"))));
                expectContent("C");
                _context2.next = 6;
                return waitFor(function () {
                  navigate("bar");
                });

              case 6:
                expectContent("BE");

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })));
    });
  });
});