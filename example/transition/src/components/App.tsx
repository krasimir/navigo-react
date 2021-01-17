import React from "react";
import styled from "styled-components";
import { Route, Switch } from "navigo-react";

import Card from "./Card";

const delay = (time: number) => new Promise((done) => setTimeout(done, time));

type ContainerProps = {
  padding?: string | 0;
  margin?: string | 0;
};

export const Container = styled.div<ContainerProps>`
  padding: 3em 0 0 0;
  margin: ${(props) => ("margin" in props ? props.margin : 0)};
`;
const leaveHook = (path: string) => async (done: Function) => {
  console.log(`Leave hook for ${path}`);
  done({ leaving: true });
  await delay(900);
  done(true);
};

export default function App() {
  return (
    <Container>
      <Switch>
        <Route path="/card-two" leave={leaveHook("card-two")}>
          <Card bgColor="#254c6a">
            Card #2.
            <br />
            <a href="/" data-navigo>
              Click here
            </a>{" "}
            to go back
          </Card>
        </Route>
        <Route path="/" leave={leaveHook("/")}>
          <Card>
            Welcome to the transition example.{" "}
            <a href="/card-two" data-navigo>
              Click here
            </a>{" "}
            to open the other card.
          </Card>
        </Route>
      </Switch>
    </Container>
  );
}
