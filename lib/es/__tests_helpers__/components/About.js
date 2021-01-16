import React from "react";
import { useNavigo } from "../../../src/NavigoReact";
export default function About() {
  var _useNavigo = useNavigo(),
      match = _useNavigo.match;

  if (match) {
    return /*#__PURE__*/React.createElement("p", null, "About");
  }

  return null;
}