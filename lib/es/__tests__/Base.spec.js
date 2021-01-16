import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { getRouter, reset, Base } from "../NavigoReact";
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
  describe("when using the Base component", function () {
    it("should allow us to set the root of the router", function () {
      render( /*#__PURE__*/React.createElement(Base, {
        path: "foo/bar"
      })); // @ts-ignore

      expect(getRouter().root).toEqual("foo/bar");
    });
  });
});