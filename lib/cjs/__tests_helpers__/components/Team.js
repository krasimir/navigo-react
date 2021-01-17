"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Team;

var _react = _interopRequireDefault(require("react"));

var _NavigoReact = require("../../../src/NavigoReact");

function Team() {
  var _useNavigo = (0, _NavigoReact.useNavigo)(),
      match = _useNavigo.match;

  if (match) {
    return /*#__PURE__*/_react["default"].createElement("p", null, "Team");
  }

  return null;
}