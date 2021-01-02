import React from "react";

import { useRoute } from "../../../src/NavigoReact";

export default function About() {
  const match = useRoute("/about");
  if (match) {
    return <p>About page</p>;
  }
  return null;
}
