import { Match } from "navigo/index.d";
import "@testing-library/jest-dom/extend-expect";
import React, { useEffect, useRef, useState } from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { configureRouter, reset } from "../NavigoReact";

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
});
