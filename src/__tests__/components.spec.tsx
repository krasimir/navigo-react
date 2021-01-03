import { Match } from "navigo/index.d";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { useRoute, useRouter, reset, Route, useMatch, Base, NotFound, useNotFound, Redirect } from "../NavigoReact";

import { expectContent, navigate } from "../__tests_helpers__/utils";
import About from "../__tests_helpers__/components/About";

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
  describe("when using the Base component", () => {
    it("should allow us to set the root of the router", () => {
      render(<Base path="foo/bar" />);
      // @ts-ignore
      expect(useRouter().root).toEqual("foo/bar");
    });
  });
  describe("when using the Route component", () => {
    it("should render the children if the path matches on the first render", async () => {
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
          <Base path="app" />
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
  describe("when using the NotFound component", () => {
    it("should allow us to handle the not-found route", async () => {
      history.pushState({}, "", "/about");
      const spy = jest.fn();
      function Comp() {
        const match = useMatch();
        if (match) {
          spy(match);
        }
        return <p>not found</p>;
      }

      render(
        <div data-testid="container">
          <About />
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
  describe("when using the Redirect component", () => {
    it("should navigate to a path", () => {
      useRouter().on("foo/bar/moo", () => {});
      expect(useRouter().lastResolved()).toEqual(null);
      render(<Redirect path="/foo/bar/moo" />);
      expect(useRouter().lastResolved()).toStrictEqual([expect.objectContaining({ url: "foo/bar/moo" })]);
    });
  });
});
