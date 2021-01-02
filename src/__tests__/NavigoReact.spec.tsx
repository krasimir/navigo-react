import { Match } from "navigo/index.d";
import "@testing-library/jest-dom/extend-expect";
import React, { useState } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { configureRouter, useRoute, useRouter, reset, Route, useMatch } from "../NavigoReact";

import { expectContent, navigate, delay } from "./utils";

import About from "./components/About";
import Team from "./components/Team";

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
    it("should be possible to do it by using Route and useMatch", async () => {
      function CompA() {
        const match = useMatch();
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
        useRouter().navigate("/foo/20");
      });
      expectContent("A");
      await waitFor(() => {
        useRouter().navigate("/foo/20/save");
      });
      expectContent("AB20");
    });
  });
  describe("when we switch between routes", () => {
    it("should properly unload the old components and render the new one", async () => {
      history.pushState({}, "", "/about/team");

      render(
        <div data-testid="container">
          <About />
          <Team />
          <Route path="/about/team">Team-footer</Route>
        </div>
      );
      expectContent("TeamTeam-footer");
      await waitFor(() => {
        useRouter().navigate("/about");
      });
      expectContent("About");
    });
  });
});
