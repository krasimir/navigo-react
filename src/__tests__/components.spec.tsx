import { Match } from "navigo/index.d";
import "@testing-library/jest-dom/extend-expect";
import React, { useState } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { configureRouter, useRoute, useRouter, reset, Route, useMatch } from "../NavigoReact";

import { expectContent } from "./utils";

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
  describe("when using the Route component", () => {
    it("should render the children if the path matches on the first render", async () => {
      configureRouter("/app");
      history.pushState({}, "", "/app/foo/bar");
      function CompA() {
        const match = useRoute("/foo/:id");
        if (match) {
          return <p>A</p>;
        }
        return null;
      }

      render(
        <div data-testid="container">
          <CompA />
          <Route path="/foo/:id">
            <p>B</p>
          </Route>
        </div>
      );
      expectContent("AB");
    });
    it("should gives us access to the Match object", () => {
      history.pushState({}, "", "/foo/bar");
      const CompB = jest.fn().mockImplementation(() => {
        const match = useMatch() as Match;
        // @ts-ignore
        return <p>B{match.data.id}</p>;
      });
      render(
        <div data-testid="container">
          <Route path="/foo/:id">
            <CompB a="b" />
          </Route>
        </div>
      );

      expect(CompB).toBeCalledTimes(1);
      expect(CompB.mock.calls[0][0]).toStrictEqual({
        a: "b",
      });
    });
  });
});
