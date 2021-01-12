import React, { useState } from "react";
import { Match } from "navigo/index.d";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { getRouter, reset, Route, useNavigo, Base, configureRouter } from "../NavigoReact";

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
  describe("when using the Route component", () => {
    it("should render the children if the path matches on the first render", async () => {
      history.pushState({}, "", "/app/foo/bar");
      function CompA() {
        const { match } = useNavigo();
        if (match) {
          return <p>A</p>;
        }
        return null;
      }

      render(
        <div data-testid="container">
          <Base path="app" />
          <Route path="/foo/:id" loose>
            <CompA />
          </Route>
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
        const { match } = useNavigo();
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
    it("should add a route and remove it when we unmount the component", async () => {
      function Wrapper() {
        const [count, setCount] = useState(0);
        if (count >= 2 && count < 4) {
          return (
            <>
              <Route path="/foo" loose>
                <Comp />
              </Route>
              <button onClick={() => setCount(count + 1)}>button</button>
            </>
          );
        }
        return <button onClick={() => setCount(count + 1)}>button</button>;
      }
      function Comp() {
        const { match } = useNavigo();
        return match ? <p>Match</p> : <p>No Match</p>;
      }

      const { getByText } = render(
        <div data-testid="container">
          <Wrapper />
        </div>
      );

      fireEvent.click(getByText("button"));
      expectContent("button");
      await waitFor(() => {
        fireEvent.click(getByText("button"));
      });
      expectContent("No Matchbutton");
      expect(getRouter().routes).toHaveLength(1);
      await waitFor(() => {
        navigate("/foo");
      });
      expectContent("Matchbutton");
      await waitFor(() => {
        fireEvent.click(getByText("button"));
      });
      await waitFor(() => {
        fireEvent.click(getByText("button"));
        fireEvent.click(getByText("button"));
      });
      expectContent("button");
      expect(getRouter().routes).toHaveLength(0);
    });
    it("should give us proper Match object if the path matches on the first render", async () => {
      history.pushState({}, "", "/foo/bar");
      function Comp() {
        const { match } = useNavigo();
        if (match) {
          // @ts-ignore
          return <p>Matching {match.data.id}</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route path="/foo/:id" loose>
            <Comp />
          </Route>
        </div>
      );
      expectContent("Matching bar");
    });
    describe("and we have multiple components", () => {
      it("should properly resolve the paths", async () => {
        function CompA() {
          const { match } = useNavigo();
          if (match) {
            // @ts-ignore
            return <p>About</p>;
          }
          return null;
        }
        function CompB() {
          const { match } = useNavigo();
          if (match) {
            // @ts-ignore
            return <p>Products</p>;
          }
          return null;
        }

        render(
          <div data-testid="container">
            <Route path="/about" loose>
              <CompA />
            </Route>
            <Route path="/products" loose>
              <CompB />
            </Route>
          </div>
        );
        expect(screen.getByTestId("container").textContent).toEqual("");
        await navigate("/about");
        expect(screen.getByTestId("container").textContent).toEqual("About");
        await navigate("products");
        expect(screen.getByTestId("container").textContent).toEqual("Products");
      });
      it("should resolve even tho there is the same path in multiple components", async () => {
        function CompA() {
          const { match } = useNavigo();
          if (match) {
            // @ts-ignore
            return <p>About1</p>;
          }
          return null;
        }
        function CompB() {
          const { match } = useNavigo();
          if (match) {
            // @ts-ignore
            return <p>About2</p>;
          }
          return null;
        }

        render(
          <div data-testid="container">
            <Route path="/about" loose>
              <CompA />
            </Route>
            <Route path="/about" loose>
              <CompB />
            </Route>
          </div>
        );
        expectContent("");
        await navigate("/about");
        expectContent("About1About2");
        await navigate("products");
        expectContent("");
      });
    });
    describe("and when we have links with data-navigo attribute", () => {
      it("should properly navigate to the new route", async () => {
        configureRouter("/app");
        function CompA() {
          return (
            <a href="/about" data-navigo>
              click me
            </a>
          );
        }
        function CompB() {
          const { match } = useNavigo();
          if (match) {
            // @ts-ignore
            return (
              <>
                <p>About</p>
                <a href="/" data-navigo>
                  home
                </a>
              </>
            );
          }
          return null;
        }

        const { getByText } = render(
          <div data-testid="container">
            <CompA />
            <Route path="/about" loose>
              <CompB />
            </Route>
          </div>
        );
        expectContent("click me");
        fireEvent.click(getByText("click me"));
        expectContent("click meAbouthome");
        await delay();
        fireEvent.click(getByText("home"));
        expectContent("click me");
      });
    });
  });
  describe("when passing a `before` function", () => {
    it("should create a before hook and allow us to send props to useNavigo hook", async () => {
      history.pushState({}, "", "/about");
      function Comp() {
        const { match, myName } = useNavigo();

        if (match) {
          return <p>Hello, {myName}</p>;
        }
        if (myName) {
          return <p>Hey, {myName}</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            loose
            before={async (done: Function) => {
              done({ myName: "Krasimir" });
              await delay(5);
              waitFor(() => {
                done({ myName: "Tsonev" });
              });
              await delay(5);
              waitFor(() => {
                done(true);
              });
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Hey, Krasimir");
      await delay(7);
      expectContent("Hey, Tsonev");
      await delay(20);
      expectContent("Hello, Tsonev");
    });
    it("should allow us to block the routing", async () => {
      history.pushState({}, "", "/");
      function Comp() {
        const { match } = useNavigo();

        if (match) {
          return <p>About</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            loose
            before={async (done: Function) => {
              done(false);
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Nope");
      getRouter().navigate("/about");
      expectContent("Nope");
      expect(location.pathname).toEqual("/");
    });
  });
  describe("when passing `after`", () => {
    it("should create an after hook and allow us to send props to useNavigo hook", async () => {
      history.pushState({}, "", "/");
      function Comp() {
        const { match, userName } = useNavigo();

        if (match && userName) {
          return <p>Hey, {userName}</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            loose
            after={async (done: Function) => {
              done({ userName: "Foo Bar" });
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Nope");
      await waitFor(() => {
        getRouter().navigate("/about");
      });
      expectContent("Hey, Foo Bar");
    });
  });
  describe("when passing `already`", () => {
    it("should create an already hook and allow us to send props to useNavigo hook", async () => {
      history.pushState({}, "", "/");
      function Comp() {
        const { match, again } = useNavigo();

        if (match && again) {
          return <p>Rendering again</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            loose
            already={async (done: Function) => {
              done({ again: true });
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Nope");
      await waitFor(() => {
        getRouter().navigate("/about");
        getRouter().navigate("/about");
      });
      expectContent("Rendering again");
    });
  });
  describe("when passing a `leave` function", () => {
    it("should create a leave hook and allow us to send props to useNavigo hook", async () => {
      history.pushState({}, "", "/");
      function Comp() {
        const { match, leaving } = useNavigo();

        if (leaving) {
          return <p>Leaving...</p>;
        }
        if (match) {
          return <p>Match</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            loose
            leave={async (done: Function) => {
              done({ leaving: true });
              await delay(10);
              waitFor(() => {
                done({ leaving: false });
                done(true);
              });
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Nope");
      await waitFor(() => {
        getRouter().navigate("/about");
      });
      expectContent("Match");
      await waitFor(() => {
        getRouter().navigate("/nah");
      });
      expectContent("Leaving...");
      await delay(20);
      expectContent("Nope");
    });
    it("should allow us to block the routing", async () => {
      history.pushState({}, "", "/");
      function Comp() {
        const { match, leaving } = useNavigo();

        if (leaving) {
          return <p>Leaving...</p>;
        }
        if (match) {
          return <p>Match</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            loose
            leave={async (done: Function) => {
              done(false);
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Nope");
      await waitFor(() => {
        getRouter().navigate("/about");
      });
      expectContent("Match");
      await waitFor(() => {
        getRouter().navigate("/nah");
      });
      expectContent("Match");
      expect(location.pathname).toEqual("/about");
    });
  });
});
