import React from "react";
import styled from "styled-components";

import Home from "./Home";
import CardTwo from "./CardTwo";

type ContainerProps = {
  padding?: string | 0;
  margin?: string | 0;
};

export const Container = styled.div<ContainerProps>`
  padding: 3em 0 0 0;
  margin: ${(props) => ("margin" in props ? props.margin : 0)};
`;

export default function App() {
  return (
    <Container>
      <Home />
      <CardTwo />
    </Container>
  );
}
