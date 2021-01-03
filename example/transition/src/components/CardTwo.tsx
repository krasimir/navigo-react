import React, { useState } from "react";

import Card, { useTransition } from "./Card";

export default function Home() {
  const [match, leaving] = useTransition("/card-two", 800);

  if (match) {
    return (
      <Card leaving={leaving} bgColor="#532222">
        This is the second card.{" "}
        <a href="/" data-navigo>
          Click here
        </a>{" "}
        to go back.
      </Card>
    );
  }
  return null;
}
