import React, { useState } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { configureRouter, useRoute, useRouter, reset, Route } from "../NavigoReact";
import "@testing-library/jest-dom/extend-expect";

const ROOT = "something";
let warn: jest.SpyInstance;

async function navigate(path: string) {
  // @ts-ignore
  await waitFor(() => {
    useRouter()[0].navigate(path);
  });
}
async function delay(ms?: number) {
  return new Promise((done) => setTimeout(done, ms || 0));
}
function expectContent(html: string) {
  expect(screen.getByTestId("container").textContent).toEqual(html);
}

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
  describe("when using the useRouter hook", () => {
    it("should give us access to the router", () => {
      function Comp() {
        const [router] = useRouter();
        // @ts-ignore
        return <p>{typeof router}</p>;
      }

      render(<Comp />);
      expect(screen.getByText("object")).toBeTruthy();
    });
  });
  describe("when we use the useRoute hook", () => {
    it("should add a route every time when we use the hook and remove the route when we unmount the component", async () => {
      function Wrapper() {
        const [count, setCount] = useState(0);
        if (count >= 2 && count < 4) {
          return (
            <>
              <Comp />
              <button onClick={() => setCount(count + 1)}>button</button>
            </>
          );
        }
        return <button onClick={() => setCount(count + 1)}>button</button>;
      }
      function Comp() {
        const [match] = useRoute("/foo");
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
      expect(useRouter()[0].routes).toHaveLength(1);
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
      expect(useRouter()[0].routes).toHaveLength(0);
    });
    it("should give us a match or false", async () => {
      function Comp() {
        const [match] = useRoute("/foo/:id");
        if (match) {
          // @ts-ignore
          return <p>Matching {match.data.id}</p>;
        }
        return <p>Nope</p>;
      }

      render(<Comp />);

      expect(screen.queryByText("Matching")).toBeNull();
      await waitFor(() => {
        useRouter()[0].navigate("/foo/bar");
      });
      expect(screen.queryByText("Matching bar")).toBeTruthy();
    });
    it("should give us proper Match object if the path matches on the first render", async () => {
      history.pushState({}, "", "/foo/bar");
      function Comp() {
        const [match] = useRoute("/foo/:id");
        if (match) {
          // @ts-ignore
          return <p>Matching {match.data.id}</p>;
        }
        return <p>Nope</p>;
      }

      render(
        <div data-testid="container">
          <Comp />
        </div>
      );
      expectContent("Matching bar");
    });
    describe("and we have multiple components using the hook", () => {
      it("should properly resolve the paths", async () => {
        function CompA() {
          const [match] = useRoute("/about");
          if (match) {
            // @ts-ignore
            return <p>About</p>;
          }
          return null;
        }
        function CompB() {
          const [match] = useRoute("/products");
          if (match) {
            // @ts-ignore
            return <p>Products</p>;
          }
          return null;
        }

        render(
          <div data-testid="container">
            <CompA />
            <CompB />
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
          const [match] = useRoute("/about");
          if (match) {
            // @ts-ignore
            return <p>About1</p>;
          }
          return null;
        }
        function CompB() {
          const [match] = useRoute("/about");
          if (match) {
            // @ts-ignore
            return <p>About2</p>;
          }
          return null;
        }

        render(
          <div data-testid="container">
            <CompA />
            <CompB />
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
          const [match] = useRoute("/about");
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
            <CompB />
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
  describe("when using the Route component", () => {
    it("should render the children if the path matches", async () => {
      configureRouter("/app");
      history.pushState({}, "", "/app/foo/bar");
      function CompA() {
        const [match] = useRoute("/foo/:id");
        if (match) {
          // @ts-ignore
          return <p>A</p>;
        }
        return null;
      }
      function CompB() {
        return <p>B</p>;
      }

      render(
        <div data-testid="container">
          <CompA />
          <Route path="/foo/:id">
            <CompB />
          </Route>
        </div>
      );
      // await delay();
      expectContent("AB");
    });
  });
});
