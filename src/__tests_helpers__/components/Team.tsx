import React from "react";

import { useMatch } from "../../../src/NavigoReact";

export default function Team() {
  const match = useMatch();
  if (match) {
    return <p>Team</p>;
  }
  return null;
}
