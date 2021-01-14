import React from "react";
import styled from "styled-components";

import { Route, Switch } from "navigo-react";
import Navigation from "./Navigation";
import About from "./About";
import Products from "./Products";
import Team from "./Team";

type ContainerProps = {
  padding?: string | 0;
  margin?: string | 0;
};

export const Container = styled.div<ContainerProps>`
  padding: ${(props) => ("padding" in props ? props.padding : "0")};
  margin: ${(props) => ("margin" in props ? props.margin : 0)};
`;

export default function App() {
  return (
    <Container padding="1em">
      <Navigation />
      <Switch>
        <Route path="/about/team">
          <Team />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/products/:type">
          <Products />
        </Route>
        <Route path="*">
          <hr />
          Home
        </Route>
      </Switch>
      <Route path="/about/team">
        <hr />
        Team page footer
      </Route>
    </Container>
  );
}
