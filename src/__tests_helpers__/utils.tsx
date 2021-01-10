import "@testing-library/jest-dom/extend-expect";
import { screen, waitFor } from "@testing-library/react";
import { getRouter } from "../../src/NavigoReact";

export async function navigate(path: string) {
  // @ts-ignore
  await waitFor(() => {
    getRouter().navigate(path);
  });
}
export async function delay(ms?: number) {
  return new Promise((done) => setTimeout(done, ms || 0));
}
export function expectContent(html: string) {
  expect(screen.getByTestId("container").textContent).toEqual(html);
}
