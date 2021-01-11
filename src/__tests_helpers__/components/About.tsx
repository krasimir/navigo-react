import React from "react";

import { useNavigo } from "../../../src/NavigoReact";

export default function About() {
  const { match } = useNavigo();
  if (match) {
    return <p>About</p>;
  }
  return null;
}
