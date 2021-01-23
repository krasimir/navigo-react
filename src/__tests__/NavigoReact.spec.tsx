import { Match } from "navigo/index.d";
import "@testing-library/jest-dom/extend-expect";
import React, { useEffect, useRef, useState } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { configureRouter, getRouter, reset, Route, useNavigo, NotFound, Redirect } from "../NavigoReact";

import { expectContent, delay } from "../__tests_helpers__/utils";

import About from "../__tests_helpers__/components/About";
import Team from "../__tests_helpers__/components/Team";

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
  describe("when we configure the router", () => {
    it("should set a proper root", () => {
      const r = configureRouter(ROOT);
      // @ts-ignore
      expect(r.root).toEqual(ROOT);
    });
  });
  describe("when we want to implement a nesting routes", () => {
    it("should be possible to do it by using Route and useNavigo", async () => {
      function CompA() {
        const { match } = useNavigo();
        if (!match) return null;
        // @ts-ignore
        const id = match.data.id;
        return (
          <>
            <p>A</p>
            <Route path={match.url + "/save"}>
              <p>B{id}</p>
            </Route>
          </>
        );
      }

      render(
        <div data-testid="container">
          <Route path="/foo/:id/?">
            <CompA />
          </Route>
        </div>
      );
      expectContent("");
      await waitFor(() => {
        getRouter().navigate("/foo/20");
      });
      expectContent("A");
      await waitFor(() => {
        getRouter().navigate("/foo/20/save");
      });
      expectContent("AB20");
    });
  });
  describe("when we switch between routes", () => {
    it("should properly unload the old components and render the new one", async () => {
      history.pushState({}, "", "/about/team");

      render(
        <div data-testid="container">
          <Route path="/about">
            <About />
          </Route>
          <Route path="/about/team">
            <Team />
          </Route>
          <Route path="/about/team">Team-footer</Route>
        </div>
      );
      expectContent("TeamTeam-footer");
      await waitFor(() => {
        getRouter().navigate("/about");
      });
      expectContent("About");
    });
  });
  describe("when we want to redirect (in case of not-found path)", () => {
    it("should provide an API for redirecting", async () => {
      history.pushState({}, "", "/nah");
      render(
        <div data-testid="container">
          <Route path="/about">
            <About />
          </Route>
          <NotFound>
            <Redirect path="about" />
          </NotFound>
        </div>
      );
      expectContent("About");
    });
  });
  describe("when we want to redirect (in case of not authorized access)", () => {
    it("should provide an API for redirecting", async () => {
      history.pushState({}, "", "/about");
      const Auth = ({ children }: { children: any }) => {
        const [authorized, setAuthorized] = useState(false);
        const location = useRef(getRouter().getCurrentLocation());

        useEffect(() => {
          setTimeout(() => {
            waitFor(() => {
              setAuthorized(true);
              getRouter().navigate(location.current.url);
            });
          }, 10);
        }, []);

        if (authorized) {
          return children;
        }
        return <Redirect path="login" />;
      };
      render(
        <div data-testid="container">
          <Auth>
            <Route path="/about">
              <About />
            </Route>
          </Auth>
          <Route path="login">Login</Route>
        </div>
      );
      expectContent("Login");
      await delay(20);
      expectContent("About");
    });
  });
});
