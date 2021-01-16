import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/react";
import { reset, Route, useNavigo, NotFound } from "../NavigoReact";
import { expectContent, navigate } from "../__tests_helpers__/utils";
import About from "../__tests_helpers__/components/About";
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
  describe("when using the NotFound component", function () {
    it("should allow us to handle the not-found route", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var spy, Comp;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              Comp = function _Comp() {
                var _useNavigo = useNavigo(),
                    match = _useNavigo.match;

                if (match) {
                  spy(match);
                }

                return /*#__PURE__*/React.createElement("p", null, "not found");
              };

              history.pushState({}, "", "/about");
              spy = jest.fn();
              render( /*#__PURE__*/React.createElement("div", {
                "data-testid": "container"
              }, /*#__PURE__*/React.createElement(Route, {
                path: "/about",
                loose: true
              }, /*#__PURE__*/React.createElement(About, null)), /*#__PURE__*/React.createElement(NotFound, null, /*#__PURE__*/React.createElement(Comp, null))));
              expectContent("About");
              _context.next = 7;
              return waitFor(function () {
                navigate("/nah");
              });

            case 7:
              expectContent("not found");
              expect(spy).toBeCalledTimes(1);
              expect(spy).toBeCalledWith({
                url: "nah",
                queryString: "",
                data: null,
                route: {
                  name: "__NOT_FOUND__",
                  path: "nah",
                  handler: expect.any(Function),
                  hooks: expect.any(Object)
                },
                params: null
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  });
});