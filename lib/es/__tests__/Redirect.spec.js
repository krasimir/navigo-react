import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { getRouter, reset, Redirect } from "../NavigoReact";
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
  describe("when using the Redirect component", function () {
    it("should navigate to a path", function () {
      getRouter().on("foo/bar/moo", function () {});
      expect(getRouter().lastResolved()).toEqual(null);
      render( /*#__PURE__*/React.createElement(Redirect, {
        path: "/foo/bar/moo"
      }));
      expect(getRouter().lastResolved()).toStrictEqual([expect.objectContaining({
        url: "foo/bar/moo"
      })]);
    });
  });
});