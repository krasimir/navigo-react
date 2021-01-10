import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { getRouter, reset, Base } from "../NavigoReact";

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
  describe("when using the Base component", () => {
    it("should allow us to set the root of the router", () => {
      render(<Base path="foo/bar" />);
      // @ts-ignore
      expect(getRouter().root).toEqual("foo/bar");
    });
  });
});
