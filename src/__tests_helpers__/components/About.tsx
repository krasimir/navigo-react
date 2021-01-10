import React from "react";

import { useMatch } from "../../../src/NavigoReact";

export default function About() {
  const match = useMatch();
  if (match) {
    return <p>About</p>;
  }
  return null;
}
