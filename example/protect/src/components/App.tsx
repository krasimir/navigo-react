import React, { useState } from "react";
import styled from "styled-components";
import { Route, Switch, getRouter, useNavigo } from "navigo-react";

type ContainerProps = {
  padding?: string | 0;
  margin?: string | 0;
};

const Container = styled.div<ContainerProps>`
  padding: 3em;
  margin: ${(props) => ("margin" in props ? props.margin : 0)};
`;

const Button = styled.button`
  padding: 1em;
  border-radius: 4px;
  border: solid 2px #17681e;
  background: #134907;
  color: white;
  font-size: 1em;
`;

let authorized = false;

function Login() {
  const { match } = useNavigo();
  return (
    <Button
      onClick={() => {
        authorized = true;
        // @ts-ignore
        getRouter().navigate(match.params.r);
      }}
    >
      Authorize me
    </Button>
  );
}

export default function App() {
  return (
    <Container>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route
          path="/get-data"
          before={(done: Function) => {
            if (authorized) {
              done(true);
            } else {
              done(false);
              getRouter().navigate("/login?r=get-data");
            }
          }}
        >
          <h1>💰</h1>
        </Route>
        <Route path="/">
          <a href="/get-data" data-navigo>
            Get the protected data
          </a>
        </Route>
      </Switch>
    </Container>
  );
}
