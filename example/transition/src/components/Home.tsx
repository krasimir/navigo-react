import React, { useState } from "react";

import Card, { useTransition } from "./Card";

export default function Home() {
  const [match, leaving] = useTransition("/");

  if (match) {
    return (
      <Card leaving={leaving}>
        Welcome to the transition example.{" "}
        <a href="/card-two" data-navigo>
          Click here
        </a>{" "}
        to open the other card.
      </Card>
    );
  }
  return null;
}
