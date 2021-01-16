import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import "@testing-library/jest-dom/extend-expect";
import React, { useEffect, useRef, useState } from "react";
import { render, waitFor } from "@testing-library/react";
import { configureRouter, getRouter, reset, Route, useNavigo, NotFound, Redirect } from "../NavigoReact";
import { expectContent, delay } from "../__tests_helpers__/utils";
import About from "../__tests_helpers__/components/About";
import Team from "../__tests_helpers__/components/Team";
var ROOT = "something";
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
  describe("when we configure the router", function () {
    it("should set a proper root", function () {
      var r = configureRouter(ROOT); // @ts-ignore

      expect(r.root).toEqual(ROOT);
    });
  });
  describe("when we want to implement a nesting routes", function () {
    it("should be possible to do it by using Route and useNavigo", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var CompA;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              CompA = function _CompA() {
                var _useNavigo = useNavigo(),
                    match = _useNavigo.match;

                if (!match) return null; // @ts-ignore

                var id = match.data.id;
                return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "A"), /*#__PURE__*/React.createElement(Route, {
                  path: match.url + "/save"
                }, /*#__PURE__*/React.createElement("p", null, "B", id)));
              };

              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/foo/:id/?"
              }, /*#__PURE__*/React.createElement(CompA, null))));
              expectContent("");
              _context.next = 5;
              return waitFor(function () {
                getRouter().navigate("/foo/20");
              });

            case 5:
              expectContent("A");
              _context.next = 8;
              return waitFor(function () {
                getRouter().navigate("/foo/20/save");
              });

            case 8:
              expectContent("AB20");

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  });
  describe("when we switch between routes", function () {
    it("should properly unload the old components and render the new one", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              history.pushState({}, "", "/about/team");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true
              }, /*#__PURE__*/React.createElement(About, null)), /*#__PURE__*/React.createElement(Route, {
                path: "/about/team",
                loose: true
              }, /*#__PURE__*/React.createElement(Team, null)), /*#__PURE__*/React.createElement(Route, {
                path: "/about/team"
              }, "Team-footer")));
              expectContent("TeamTeam-footer");
              _context2.next = 5;
              return waitFor(function () {
                getRouter().navigate("/about");
              });

            case 5:
              expectContent("About");

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  describe("when we want to redirect (in case of not-found path)", function () {
    it("should provide an API for redirecting", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              history.pushState({}, "", "/nah");
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true
              }, /*#__PURE__*/React.createElement(About, null)), /*#__PURE__*/React.createElement(NotFound, null, /*#__PURE__*/React.createElement(Redirect, {
                path: "about"
              }))));
              expectContent("About");

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
  describe("when we want to redirect (in case of not authorized access)", function () {
    it("should provide an API for redirecting", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4() {
      var Auth;
      return _regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              history.pushState({}, "", "/about");

              Auth = function Auth(_ref5) {
                var children = _ref5.children;

                var _useState = useState(false),
                    authorized = _useState[0],
                    setAuthorized = _useState[1];

                var location = useRef(getRouter().getCurrentLocation());
                useEffect(function () {
                  setTimeout(function () {
                    waitFor(function () {
                      setAuthorized(true);
                      getRouter().navigate(location.current.url);
                    });
                  }, 10);
                }, []);

                if (authorized) {
                  return children;
                }

                return /*#__PURE__*/React.createElement(Redirect, {
                  path: "login"
                });
              };

              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Auth, null, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true
              }, /*#__PURE__*/React.createElement(About, null))), /*#__PURE__*/React.createElement(Route, {
                path: "login"
              }, "Login")));
              expectContent("Login");
              _context4.next = 6;
              return delay(20);

            case 6:
              expectContent("About");

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
});