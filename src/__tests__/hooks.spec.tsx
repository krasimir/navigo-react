import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render } from "@testing-library/react";
import { reset, useNavigo, useLocation } from "../NavigoReact";

import { expectContent } from "../__tests_helpers__/utils";

const ROOT = "something";
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
  describe("when using the `useNavigo` hook", () => {
    it("should return `false` from `useNavigo` if there is no match or a context", () => {
      const CompA = jest.fn().mockImplementation(() => {
        const { match } = useNavigo();
        if (!match) {
          return <p>Nope</p>;
        }
        return <p>Never</p>;
      });
      render(
        <div data-testid="container">
          <CompA />
        </div>
      );

      expect(CompA).toBeCalledTimes(1);
      expectContent("Nope");
    });
    it("should return `false` from `useNavigo` if there is no match or a context", () => {
      const CompA = jest.fn().mockImplementation(() => {
        const { match } = useNavigo();
        if (!match) {
          return <p>Nope</p>;
        }
        return <p>Never</p>;
      });
      render(
        <div data-testid="container">
          <CompA />
        </div>
      );

      expect(CompA).toBeCalledTimes(1);
      expectContent("Nope");
    });
  });
  describe("when we use the `useLocation` hook", () => {
    it("should gives us access to the current location of the browser", () => {
      history.pushState({}, "", "/about?a=b");
      expect(useLocation()).toStrictEqual({
        url: "about",
        queryString: "a=b",
        route: {
          name: "about",
          path: "about",
          handler: expect.any(Function),
          hooks: {},
        },
        data: null,
        params: { a: "b" },
      });
    });
  });
});
