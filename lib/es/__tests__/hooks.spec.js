import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render } from "@testing-library/react";
import { reset, useNavigo, useLocation } from "../NavigoReact";
import { expectContent } from "../__tests_helpers__/utils";
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
  describe("when using the `useNavigo` hook", function () {
    it("should return `false` from `useNavigo` if there is no match or a context", function () {
      var CompA = jest.fn().mockImplementation(function () {
        var _useNavigo = useNavigo(),
            match = _useNavigo.match;

        if (!match) {
          return /*#__PURE__*/React.createElement("p", null, "Nope");
        }

        return /*#__PURE__*/React.createElement("p", null, "Never");
      });
      render( /*#__PURE__*/React.createElement("div", {
        "data-testid": "container"
      }, /*#__PURE__*/React.createElement(CompA, null)));
      expect(CompA).toBeCalledTimes(1);
      expectContent("Nope");
    });
    it("should return `false` from `useNavigo` if there is no match or a context", function () {
      var CompA = jest.fn().mockImplementation(function () {
        var _useNavigo2 = useNavigo(),
            match = _useNavigo2.match;

        if (!match) {
          return /*#__PURE__*/React.createElement("p", null, "Nope");
        }

        return /*#__PURE__*/React.createElement("p", null, "Never");
      });
      render( /*#__PURE__*/React.createElement("div", {
        "data-testid": "container"
      }, /*#__PURE__*/React.createElement(CompA, null)));
      expect(CompA).toBeCalledTimes(1);
      expectContent("Nope");
    });
  });
  describe("when we use the `useLocation` hook", function () {
    it("should gives us access to the current location of the browser", function () {
      history.pushState({}, "", "/about?a=b");
      expect(useLocation()).toStrictEqual({
        url: "about",
        queryString: "a=b",
        route: {
          name: "about",
          path: "about",
          handler: expect.any(Function),
          hooks: {}
        },
        data: null,
        params: {
          a: "b"
        }
      });
    });
  });
});