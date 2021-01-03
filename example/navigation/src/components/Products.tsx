import { Match } from "navigo";
import React from "react";

import { useRoute } from "navigo-react";

export default function Products() {
  const match = useRoute("/products/:type");

  if (match) {
    // @ts-ignore
    return <p>Product. Type: {match.data.type}</p>;
  }
  return null;
}
