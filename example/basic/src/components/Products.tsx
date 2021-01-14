import React from "react";

import { useNavigo } from "navigo-react";

export default function Products() {
  const { match } = useNavigo();

  if (match) {
    // @ts-ignore
    return <p>Product. Type: {match.data.type}</p>;
  }
  return null;
}
