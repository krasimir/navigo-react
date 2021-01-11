import React from "react";

import { useNavigo } from "../../../src/NavigoReact";

export default function Team() {
  const { match } = useNavigo();
  if (match) {
    return <p>Team</p>;
  }
  return null;
}
