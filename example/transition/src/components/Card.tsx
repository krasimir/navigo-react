import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigo } from "navigo-react";

type CardContainerTypes = {
  leaving?: boolean;
  bgColor?: string;
};

const IN = keyframes`
  0% { opacity: 0; transform: translateX(200px); }
  100% { opacity: 1; transform: translateX(0); }
`;
const OUT = keyframes`
  0% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(-200px); }
`;

const CardContainer = styled.div<CardContainerTypes>`
  width: 300px;
  height: 450px;
  border-radius: 10px;
  display: grid;
  align-items: center;
  text-align: center;
  background: ${(props) => props.bgColor || "#1f431f"};
  color: #fff;
  margin: 0 auto;
  transform-origin: center;
  border: solid 2px #4f4f4f;
  box-shadow: 0px 0px 15px -3px #000000;
  animation: ${(props) => (props.leaving ? OUT : IN)} 1000ms cubic-bezier(1, -0.28, 0.28, 1.49);
`;

const Paragraph = styled.p`
  padding: 0 1em;
  font-size: 1.2em;
  line-height: 1.4;
`;

export default function Card({ children, bgColor }: { children: any; bgColor?: string }) {
  const { leaving } = useNavigo();

  return (
    <CardContainer leaving={leaving} bgColor={bgColor}>
      <Paragraph>{children}</Paragraph>
    </CardContainer>
  );
}
