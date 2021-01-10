import React, { useState } from "react";
import { Match } from "navigo/index.d";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { getRouter, reset, Redirect } from "../NavigoReact";

let warn: jest.SpyInstance;

describe("Given navigo-react", () => {
  beforeEach(() => {
    reset();
    warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    history.pushState({}, "", "/");
  });
  afterEach(() => {
    if (warn) {
      warn.mockReset();
    }
  });
  describe("when using the Redirect component", () => {
    it("should navigate to a path", () => {
      getRouter().on("foo/bar/moo", () => {});
      expect(getRouter().lastResolved()).toEqual(null);
      render(<Redirect path="/foo/bar/moo" />);
      expect(getRouter().lastResolved()).toStrictEqual([expect.objectContaining({ url: "foo/bar/moo" })]);
    });
  });
});
