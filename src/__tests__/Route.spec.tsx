import React, { useState } from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { getRouter, reset, Route, useNavigo, Base, configureRouter, Switch } from "../NavigoReact";

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
          <Route path="/foo/:id">
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
              <Route path="/foo">
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
      fireEvent.click(getByText("button"));
      fireEvent.click(getByText("button"));
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
          <Route path="/foo/:id">
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
            <Route path="/about">
              <CompA />
            </Route>
            <Route path="/products">
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
            <Route path="/about">
              <CompA />
            </Route>
            <Route path="/about">
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
            <Route path="/about">
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
    it("should create a before hook and allow us render with specific args", async () => {
      const handler = jest.fn().mockImplementation(async ({ render, done }) => {
        render({ myName: "Krasimir" });
        await delay(5);
        waitFor(() => {
          render({ myName: "Tsonev" });
        });
        await delay(5);
        waitFor(() => {
          done();
        });
      });
      history.pushState({}, "", "/about");
      function Comp() {
        const { match, myName } = useNavigo();

        if (match) {
          return <p>Hello, {myName}</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route path="/about" before={handler}>
            <Comp />
          </Route>
        </div>
      );

      expectContent("Hello, Krasimir");
      await delay(7);
      expectContent("Hello, Tsonev");
      await delay(20);
      expectContent("Hello, Tsonev");
      expect(handler).toBeCalledTimes(1);
      expect(handler).toBeCalledWith({
        render: expect.any(Function),
        done: expect.any(Function),
        match: expect.objectContaining({ url: "about" }),
      });
    });
    it("should allow us to block the routing", async () => {
      history.pushState({}, "", "/");
      function Comp() {
        return <p>About</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            before={({ done }) => {
              done(false);
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("");
      getRouter().navigate("/about");
      expectContent("");
      expect(location.pathname).toEqual("/");
    });
    it("should accumulate state", async () => {
      history.pushState({}, "", "/about");
      const spy = jest.fn();
      function Comp() {
        spy(useNavigo());

        return <p>Hey</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            before={async ({ render, done }) => {
              render({ a: "b" });
              await delay(2);
              waitFor(() => {
                render({ c: "d" });
              });
              await delay(2);
              waitFor(() => {
                done();
              });
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      await delay(20);
      expect(spy).toBeCalledTimes(3);
      expect(spy.mock.calls[0][0]).toStrictEqual({
        match: expect.objectContaining({ url: "about" }),
        a: "b",
        __allowRender: true,
      });
      expect(spy.mock.calls[1][0]).toStrictEqual({
        match: expect.objectContaining({ url: "about" }),
        a: "b",
        c: "d",
        __allowRender: true,
      });
      expect(spy.mock.calls[2][0]).toStrictEqual({
        match: expect.objectContaining({ url: "about" }),
        a: "b",
        c: "d",
        __allowRender: true,
      });
    });
    it("should keep the scope of the before hook and give access to the latest state values", () => {
      history.pushState({}, "", "/");
      const spy = jest.fn();
      function Comp() {
        const [count, setCount] = useState(0);
        const before = ({ done }) => {
          spy(count);
          done();
        };

        return (
          <>
            <a href="/about" data-navigo>
              about
            </a>
            <Route path="/about" before={before}>
              About page
            </Route>
            <button onClick={() => setCount(count + 1)} data-testid="c">
              click me {count}
            </button>
          </>
        );
      }
      const { getByTestId, getByText } = render(
        <div data-testid="container">
          <Comp />
        </div>
      );

      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      expectContent("aboutclick me 3");
      fireEvent.click(getByText("about"));
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(3);
    });
    it("should keep the scope of the after hook and give access to the latest state values", () => {
      history.pushState({}, "", "/");
      const spy = jest.fn();
      function Comp() {
        const [count, setCount] = useState(0);
        const after = ({ render }) => {
          spy(count);
        };

        return (
          <>
            <a href="/about" data-navigo>
              about
            </a>
            <Route path="/about" after={after}>
              About
            </Route>
            <button onClick={() => setCount(count + 1)} data-testid="c">
              click me {count}
            </button>
          </>
        );
      }
      const { getByTestId, getByText } = render(
        <div data-testid="container">
          <Comp />
        </div>
      );

      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      expectContent("aboutclick me 3");
      fireEvent.click(getByText("about"));
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(3);
      expectContent("aboutAboutclick me 3");
    });
    it("should keep the scope of the already hook and give access to the latest state values", () => {
      history.pushState({}, "", "/");
      const spy = jest.fn();
      function Comp() {
        const [count, setCount] = useState(0);
        const already = ({ render }) => {
          spy(count);
        };

        return (
          <>
            <a href="/about" data-navigo>
              about
            </a>
            <Route path="/about" already={already}>
              About
            </Route>
            <button onClick={() => setCount(count + 1)} data-testid="c">
              click me {count}
            </button>
          </>
        );
      }
      const { getByTestId, getByText } = render(
        <div data-testid="container">
          <Comp />
        </div>
      );

      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      expectContent("aboutclick me 3");
      fireEvent.click(getByText("about"));
      fireEvent.click(getByText("about"));
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(3);
      expectContent("aboutAboutclick me 3");
    });
    it("should keep the scope of the leave hook and give access to the latest state values", () => {
      history.pushState({}, "", "/about");
      const spy = jest.fn();
      function Comp() {
        const [count, setCount] = useState(0);
        const leave = ({ render, done }) => {
          spy(count);
        };

        return (
          <>
            <Route path="/about" leave={leave}>
              About
            </Route>
            <button onClick={() => setCount(count + 1)} data-testid="c">
              click me {count}
            </button>
          </>
        );
      }
      const { getByTestId } = render(
        <div data-testid="container">
          <Comp />
        </div>
      );

      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      fireEvent.click(getByTestId("c"));
      expectContent("Aboutclick me 3");
      getRouter().navigate("/nope");
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(3);
    });
  });
  describe("when passing `after`", () => {
    it("should create an after hook and allow us to send props to useNavigo hook", async () => {
      history.pushState({}, "", "/about");
      function Comp() {
        const { match, userName } = useNavigo();

        if (userName) {
          return <p>Hey, {userName}</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            after={async ({ render }) => {
              await delay(10);
              await waitFor(() => {
                render({ userName: "Foo Bar" });
              });
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Nope");
      await delay(20);
      expectContent("Hey, Foo Bar");
    });
  });
  describe("when passing `already`", () => {
    it("should create an already hook and allow us to send props to useNavigo hook", async () => {
      history.pushState({}, "", "/about");
      function Comp() {
        const { again } = useNavigo();

        if (again) {
          return <p>Rendering again</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            already={async ({ render }) => {
              render({ again: true });
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
      expectContent("Rendering again");
    });
  });
  describe("when passing a `leave` function", () => {
    it("should create a leave hook and allow us to send props to useNavigo hook", async () => {
      history.pushState({}, "", "/about");
      function Comp() {
        const { leaving } = useNavigo();

        if (leaving) {
          return <p>Leaving...</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            leave={async ({ render, done }) => {
              render({ leaving: true });
              await delay(10);
              waitFor(() => {
                render({ leaving: false });
                done();
              });
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Nope");
      await waitFor(() => {
        getRouter().navigate("/nah");
      });
      expectContent("Leaving...");
      await delay(20);
      expectContent("Nope");
    });
    it("should allow us to block the routing", async () => {
      history.pushState({}, "", "/about");
      function Comp() {
        return <p>Not leaving!</p>;
      }

      render(
        <div data-testid="container">
          <Route
            path="/about"
            leave={async ({ done }) => {
              done(false);
            }}
          >
            <Comp />
          </Route>
        </div>
      );

      expectContent("Not leaving!");
      await waitFor(() => {
        getRouter().navigate("/nah");
      });
      expectContent("Not leaving!");
      expect(location.pathname).toEqual("/about");
    });
  });
  describe("when passing a name", () => {
    it("should be possible to navigate to that same route later", async () => {
      history.pushState({}, "", "/");
      function Users() {
        const { match } = useNavigo();
        // @ts-ignore
        return <p>Hello, {match.data.name}</p>;
      }

      render(
        <div data-testid="container">
          <Switch>
            <Route path="/users/:name" name="user">
              <Users />
            </Route>
          </Switch>
        </div>
      );

      expectContent("");
      await waitFor(() => {
        getRouter().navigateByName("user", { name: "krasimir" });
      });
      expectContent("Hello, krasimir");
    });
  });
});
