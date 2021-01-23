import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/react";
import { reset, Route, useNavigo, NotFound } from "../NavigoReact";

import { expectContent, navigate } from "../__tests_helpers__/utils";
import About from "../__tests_helpers__/components/About";

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
  describe("when using the NotFound component", () => {
    it("should allow us to handle the not-found route", async () => {
      history.pushState({}, "", "/about");
      const spy = jest.fn();
      function Comp() {
        const { match } = useNavigo();
        if (match) {
          spy(match);
        }
        return <p>not found</p>;
      }

      render(
        <div data-testid="container">
          <Route path="/about">
            <About />
          </Route>
          <NotFound>
            <Comp />
          </NotFound>
        </div>
      );

      expectContent("About");
      await waitFor(() => {
        navigate("/nah");
      });
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
          hooks: expect.any(Object),
        },
        params: null,
      });
    });
  });
});
