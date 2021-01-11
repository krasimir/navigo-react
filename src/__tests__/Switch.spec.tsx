import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor } from "@testing-library/react";
import { reset, Route, Switch } from "../NavigoReact";

import { expectContent, navigate, delay } from "../__tests_helpers__/utils";

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
  describe("when using the Switch component", () => {
    it("should resolve only one of the routes in the list", async () => {
      render(
        <div data-testid="container">
          <Switch>
            <Route path="/foo">A</Route>
            <Route path="/bar">B</Route>
            <Route path="/">C</Route>
            <Route path="*">D</Route>
          </Switch>
          <div>
            <Route path="/bar">E</Route>
          </div>
        </div>
      );

      expectContent("C");
      // await waitFor(() => {
      //   navigate("bar");
      // });
      // expectContent("BE");
      // await waitFor(() => {
      //   navigate("nope");
      // });
      // expectContent("D");
      // await waitFor(() => {
      //   navigate("foo");
      // });
      // expectContent("A");
    });
  });
});
