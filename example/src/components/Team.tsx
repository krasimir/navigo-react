import React from "react";

import { useRoute } from "../../../src/NavigoReact";

export default function Team() {
  const [match] = useRoute("/about/team");
  if (match) {
    return <p>Team page</p>;
  }
  return null;
}
