import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { configureRouter, useRoute, useRouter, reset } from "../NavigoReact";
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
});
