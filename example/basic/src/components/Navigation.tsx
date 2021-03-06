import React from "react";
import styled from "styled-components";

import { getRouter } from "navigo-react";

const Link = styled.a`
  display: inline-block;
  margin-right: 1em;
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  text-decoration: underline;
`;

export default function Navigation() {
  return (
    <nav>
      <Link href="/" data-navigo>
        Home
      </Link>
      <Link href="/about" data-navigo>
        About
      </Link>
      <Link href="/about/team" data-navigo>
        Team
      </Link>
      <Link href="/products/one" data-navigo>
        One
      </Link>
      <Link onClick={() => getRouter().navigate("/products/two")}>Two</Link>
      <Link data-navigo href="/foobar">
        No match
      </Link>
    </nav>
  );
}
